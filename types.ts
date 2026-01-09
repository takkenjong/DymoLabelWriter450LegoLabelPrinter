
export interface Printer {
  name: string;
  modelName: string;
  isConnected: boolean;
  isLocal: boolean;
  printerType?: string;
}

export interface LabelTemplate {
  id: string;
  name: string;
  xml: string;
  description: string;
  isDynamic?: boolean;
  isCategory?: boolean;
}

export interface LabelData {
  text: string;
  id?: string;
  name?: string;
  description?: string;
  urlBA?: string;
  urlBL?: string;
  imgSrc?: string;
}

export enum DymoServiceStatus {
  UNINITIALIZED = 'UNINITIALIZED',
  CHECKING = 'CHECKING',
  READY = 'READY',
  SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
  ERROR = 'ERROR'
}

export interface GeminiSuggestion {
  formattedText: string;
  explanation: string;
  type: 'address' | 'organize' | 'barcode' | 'general';
}
