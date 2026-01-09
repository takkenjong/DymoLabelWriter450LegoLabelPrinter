
import { Printer, DymoServiceStatus, LabelData, LabelTemplate } from '../types';

export interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

const TRANSPARENT_PIXEL = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

export class DymoService {
  private static instance: DymoService;
  private baseUrl = "https://localhost:41951";
  public logs: DebugLog[] = [];
  private onLogListeners: ((log: DebugLog) => void)[] = [];
  
  private constructor() {}

  static getInstance(): DymoService {
    if (!DymoService.instance) {
      DymoService.instance = new DymoService();
    }
    return DymoService.instance;
  }

  private log(level: 'info' | 'warn' | 'error' | 'debug', message: any, data?: any) {
    const safeStringify = (val: any): string => {
      if (val === undefined) return "undefined";
      if (val === null) return "null";
      if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
      if (typeof val === 'object') {
        try {
          return JSON.stringify(val, (key, value) => {
            if (typeof value === 'bigint') return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return `[Object: ${String(val)}]`;
        }
      }
      return String(val);
    };

    const msgString = typeof message === 'string' ? message : safeStringify(message);
    
    const logEntry: DebugLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message: msgString,
      data: data ? JSON.parse(safeStringify(data)) : null 
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > 50) this.logs.pop();
    this.onLogListeners.forEach(listener => listener(logEntry));
    
    if (data) console[level](`[DYMO] ${msgString}`, data);
    else console[level](`[DYMO] ${msgString}`);
  }

  public subscribeToLogs(listener: (log: DebugLog) => void) {
    this.onLogListeners.push(listener);
    return () => {
      this.onLogListeners = this.onLogListeners.filter(l => l !== listener);
    };
  }

  async checkService(): Promise<DymoServiceStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const response = await fetch(`${this.baseUrl}/api/addin/checkApiStatus`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response.ok ? DymoServiceStatus.READY : DymoServiceStatus.SERVICE_NOT_FOUND;
    } catch (e) {
      return DymoServiceStatus.SERVICE_NOT_FOUND;
    }
  }

  async getPrinters(): Promise<Printer[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/addin/get-printers`);
      if (!response.ok) return [];
      const data = await response.json();
      const printerList = data.responseValue || (Array.isArray(data) ? data : []);
      return printerList.map((p: any) => ({
        name: p.name || p.Name || "Unknown",
        modelName: p.modelName || p.ModelName || "DYMO Printer",
        isConnected: p.isConnected !== false,
        isLocal: true,
        printerType: p.printerType || p.PrinterType || "LabelWriterPrinter"
      }));
    } catch (err) {
      return [];
    }
  }

  private async getResizedBase64Image(url: string): Promise<string | null> {
    if (!url || !url.startsWith('http')) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxSize = 250;
          let w = img.width, h = img.height;
          if (w > h) { if (w > maxSize) { h *= maxSize / w; w = maxSize; } }
          else { if (h > maxSize) { w *= maxSize / h; h = maxSize; } }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/png').split(',')[1]);
          } else resolve(null);
        } catch (e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  private wrapText(str: string, maxChars: number): string {
    if (!str) return "";
    // Replace & first to avoid breaking amp escapes later
    const escaped = str.replace(/&/g, "&amp;");
    // Respect manual linebreaks by splitting first
    const sections = escaped.split(/\n|\r/);
    const finalLines: string[] = [];

    sections.forEach(section => {
      let words = section.split(' ');
      let currentLine = "";
      words.forEach(word => {
          if ((currentLine + word).length > maxChars) {
              if (currentLine) finalLines.push(currentLine.trim());
              currentLine = word + " ";
          } else {
              currentLine += word + " ";
          }
      });
      if (currentLine) finalLines.push(currentLine.trim());
    });
    
    return finalLines.join('&#13;');
  }

  private async prepareLabelXml(xml: string, data: LabelData): Promise<string> {
    if (!xml) return "";
    let processed = xml.trim();

    const esc = (s: string | undefined) => (s || "").toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    processed = processed.replace(/{PART_ID}/g, esc(data.id));
    processed = processed.replace(/{PART_NAME}/g, esc(data.name).substring(0, 45));
    processed = processed.replace(/{PART_DESC}/g, this.wrapText(data.description || "", 25));
    processed = processed.replace(/{URL_BA}/g, esc(data.urlBA));
    processed = processed.replace(/{URL_BL}/g, esc(data.urlBL));

    if (processed.includes("{IMG_DATA}")) {
      const base64 = await this.getResizedBase64Image(data.imgSrc || '');
      processed = processed.replace(/{IMG_DATA}/g, base64 || TRANSPARENT_PIXEL);
    }

    return processed;
  }

  async renderLabel(template: LabelTemplate, labelData: LabelData, printerName?: string): Promise<string> {
    try {
      const labelXml = await this.prepareLabelXml(template.xml, labelData);
      
      let targetPrinter = printerName;
      if (!targetPrinter) {
        const printers = await this.getPrinters();
        if (printers.length > 0) targetPrinter = printers[0].name;
      }

      const params = new URLSearchParams();
      params.append('labelXml', labelXml);
      params.append('renderParamsXml', '<LabelRenderParams />');
      params.append('printerName', targetPrinter || 'DYMO LabelWriter 450');

      const response = await fetch(`${this.baseUrl}/DYMO/DLS/Printing/RenderLabel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const cleanErr = errorBody.match(/<Message>([^<]+)<\/Message>/)?.[1] || errorBody;
        this.log('error', `Render Label failed: HTTP ${response.status} - ${cleanErr}`);
        return '';
      }

      const rawText = await response.text();
      const match = rawText.match(/>([^<]+)</);
      const cleanBase64 = (match ? match[1] : rawText.replace(/<[^>]*>/g, '')).replace(/"/g, '').trim();
      return `data:image/png;base64,${cleanBase64}`;
    } catch (err: any) {
      this.log('error', 'Render exception occurred', err);
      return '';
    }
  }

  async printLabel(printerName: string, template: LabelTemplate, labelData: LabelData): Promise<boolean> {
    try {
      this.log('info', `Sending print job to ${printerName}...`);
      const labelXml = await this.prepareLabelXml(template.xml, labelData);
      const params = new URLSearchParams();
      params.append('printerName', printerName);
      params.append('printParamsXml', '<LabelWriterPrintParams><PaperName>S0722540</PaperName></LabelWriterPrintParams>');
      params.append('labelXml', labelXml);
      params.append('labelSetXml', '');

      const response = await fetch(`${this.baseUrl}/DYMO/DLS/Printing/PrintLabel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.log('error', `Print Label failed: HTTP ${response.status}`, { detail: errorBody });
        return false;
      }
      this.log('info', 'Print successful');
      return true;
    } catch (err: any) {
      this.log('error', 'Print exception occurred', err);
      return false;
    }
  }
}

export const dymoService = DymoService.getInstance();
