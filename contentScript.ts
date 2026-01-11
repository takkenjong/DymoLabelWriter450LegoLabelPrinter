
import { dymoService } from './services/dymoService';
import { TEMPLATES } from './constants';
import { LabelData } from './types';

const BUTTON_STYLE = `margin-left:4px;background-color:#10b981;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:700;vertical-align:middle;box-shadow:0 1px 2px rgba(0,0,0,0.2);transition:all 0.2s;line-height:1.2;`;

function createPrintButton(onPrint: () => Promise<boolean>) {
  const btn = document.createElement('button');
  btn.innerText = `🖨️`;
  btn.style.cssText = BUTTON_STYLE;
  btn.onclick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const orig = btn.innerText; btn.innerText = "..."; btn.disabled = true;
    try {
      const printers = await dymoService.getPrinters();
      if (!printers.length) { alert("DYMO Service not found."); btn.innerText = orig; btn.disabled = false; return; }
      const success = await onPrint();
      btn.innerText = success ? "✅" : "❌";
      setTimeout(() => { btn.innerText = orig; btn.disabled = false; }, 2000);
    } catch (err) { btn.innerText = "❌"; btn.disabled = false; }
  };
  return btn;
}

async function fetchPriceGuideInfo(id: string, type: string) {
    const url = `https://www.bricklink.com/catalogPG.asp?${type}=${id}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        let usedAvg = "N/A";
        
        const rows = Array.from(doc.querySelectorAll('tr'));
        rows.forEach(row => {
            const rowText = row.textContent || "";
            if (rowText.includes('Average:') && rowText.includes('Used')) {
                usedAvg = row.querySelector('td:last-child')?.textContent?.trim() || "N/A";
            }
        });
        return { usedAvg };
    } catch (e) {
        return { usedAvg: "Err" };
    }
}

function initBrickLink() {
  const params = new URLSearchParams(window.location.search);
  const idP = params.get('P')?.split('__')[0];
  const idS = params.get('S')?.split('__')[0];
  const idM = params.get('M')?.split('__')[0];
  const id = idP || idS || idM;
  if (!id) return;
  
  const nameElem = document.getElementById('item-name-title');
  if (!nameElem || nameElem.dataset.dymoInjected) return;

  const btn = createPrintButton(async () => {
    const meta: string[] = [];
    const typeKey = idS ? "S" : (idM ? "M" : "P");
    
    // Used Value
    if (idS || idM) {
        const prices = await fetchPriceGuideInfo(id, typeKey);
        meta.push(`Value: ${prices.usedAvg}`);
    }

    const year = document.getElementById('yearReleasedSec')?.textContent?.trim() || 
                 Array.from(document.querySelectorAll('td')).find(td => td.textContent?.includes('Year Released:'))?.querySelector('a')?.textContent?.trim();
    if (year) meta.push(`Year: ${year}`);

    const consistsTd = Array.from(document.querySelectorAll('td')).find(td => td.textContent?.includes('Item Consists Of'));
    if (consistsTd) {
        const partLink = consistsTd.querySelector('a[href*="catalogItemInv.asp"]');
        if (partLink) meta.push(`Parts: ${partLink.textContent?.split(' ')[0]}`);
        const figLink = consistsTd.querySelector('a[href*="viewItemType=M"]');
        if (figLink) meta.push(`Figs: ${figLink.textContent?.split(' ')[0]}`);
    }

    const weight = document.getElementById('item-weight-info')?.textContent?.trim();
    const dim = document.getElementById('dimSec')?.textContent?.trim();
    if (weight) meta.push(`Wgt: ${weight}`);
    if (dim) meta.push(`Dim: ${dim}`);

    let imgSrc = (document.getElementById('_idImageMain') as HTMLImageElement)?.src || 
                 (document.getElementById('img-viewer-main-img') as HTMLImageElement)?.src;
    if (!imgSrc || imgSrc.includes('transparent.png')) {
       imgSrc = (document.querySelector('.pciImageMain') as HTMLImageElement)?.src || 
                (document.querySelector('meta[property="og:image"]') as HTMLMetaElement)?.content;
    }

    const labelData: LabelData = {
      text: `${id}\n${nameElem.innerText.trim()}`,
      id,
      name: nameElem.innerText.trim(),
      urlBL: window.location.href,
      urlBA: `https://brickarchitect.com/parts/${id}`,
      imgSrc: imgSrc || '',
      description: meta.length ? meta.join('\n') : `LEGO Item`
    };

    const printers = await dymoService.getPrinters();
    return dymoService.printLabel(printers[0].name, TEMPLATES[1], labelData);
  });
  
  nameElem.appendChild(btn);
  nameElem.dataset.dymoInjected = "true";
}

function initBrickArchitect() {
    const h1 = document.querySelector('h1');
    if (h1 && !h1.dataset.dymoInjected && window.location.pathname.match(/\/parts\/([^\/\?]+)/) && !window.location.pathname.includes('category-')) {
        const idMatch = h1.textContent?.match(/\(Part ([^\)]+)\)/);
        const id = idMatch ? idMatch[1] : window.location.pathname.split('/').filter(x => x).pop() || "";
        const img = document.querySelector('.partoverview img') as HTMLImageElement;
        const imgSrc = img ? img.src : '';
        const name = h1.innerText.split('(')[0].trim();

        const labelData: LabelData = {
            text: `${id}\n${name}`,
            id,
            name,
            urlBA: window.location.href,
            urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}`,
            imgSrc,
            description: "LEGO Part"
        };

        const btn = createPrintButton(async () => {
            const printers = await dymoService.getPrinters();
            return dymoService.printLabel(printers[0].name, TEMPLATES[0], labelData);
        });
        h1.appendChild(btn);
        h1.dataset.dymoInjected = "true";
    }

    const cards = document.querySelectorAll('.partcontainer');
    cards.forEach((card: any) => {
        if (card.dataset.dymoInjected) return;
        const link = card.closest('a') as HTMLAnchorElement;
        if (!link) return;
        const numElem = card.querySelector('.partnum');
        const nameElem = card.querySelector('.partname');
        const imgElem = card.querySelector('img');
        if (!numElem) return;
        const id = numElem.textContent?.trim() || '';
        const name = nameElem?.textContent?.trim() || '';
        
        const labelData: LabelData = {
            text: `${id}\n${name}`,
            id,
            name,
            urlBA: link.href,
            urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}`,
            imgSrc: imgElem ? imgElem.src : '',
            description: "LEGO Part"
        };
        const btn = createPrintButton(async () => {
            const printers = await dymoService.getPrinters();
            return dymoService.printLabel(printers[0].name, TEMPLATES[0], labelData);
        });
        const textArea = card.querySelector('div[style*="display:flex"]') || card;
        textArea.appendChild(btn);
        card.dataset.dymoInjected = "true";
    });

    if (h1 && !h1.dataset.dymoInjected && window.location.pathname.includes('category-')) {
        const name = h1.innerText.split('(')[0].trim();
        const summary = (document.querySelector('.category_summary') as HTMLElement)?.innerText.trim();
        
        const labelData: LabelData = {
            text: `${name}\nCategory`,
            id: name,
            name: "Category",
            description: summary || "LEGO parts category",
            urlBA: window.location.href,
            urlBL: ""
        };
        h1.appendChild(createPrintButton(async () => {
            const printers = await dymoService.getPrinters();
            return dymoService.printLabel(printers[0].name, TEMPLATES[2], labelData);
        }));
        h1.dataset.dymoInjected = "true";
    }
}

const observer = new MutationObserver(() => {
    const host = window.location.hostname;
    if (host.includes('bricklink.com')) initBrickLink();
    else if (host.includes('brickarchitect.com')) initBrickArchitect();
});

observer.observe(document.body, { childList: true, subtree: true });
