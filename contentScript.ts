
import { dymoService } from './services/dymoService';
import { TEMPLATES } from './constants';
import { LabelData } from './types';

const BUTTON_STYLE = `margin-left:10px;background-color:#10b981;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;vertical-align:middle;box-shadow:0 1px 2px rgba(0,0,0,0.1);transition:all 0.2s;font-family:system-ui,-apple-system,sans-serif;`;

function createPrintButton(text: string, onPrint: () => Promise<boolean>) {
  const btn = document.createElement('button');
  btn.innerText = text ? `🖨️ ${text}` : `🖨️`;
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

function initBrickLink() {
  const params = new URLSearchParams(window.location.search);
  const idP = params.get('P')?.split('__')[0];
  const idS = params.get('S')?.split('__')[0];
  const idM = params.get('M')?.split('__')[0];
  const id = idP || idS || idM;
  if (!id) return;
  
  const nameElem = document.getElementById('item-name-title');
  if (!nameElem || nameElem.dataset.dymoInjected) return;
  
  let details = [];
  let typeKey = "P";
  if (idS) { details.push("LEGO Set"); typeKey = "S"; }
  else if (idM) { details.push("LEGO Minifigure"); typeKey = "M"; }
  else details.push("LEGO Part");

  const cleanUrlBL = `https://www.bricklink.com/v2/catalog/catalogitem.page?${typeKey}=${id}#T=S&O={"iconly":0}`;

  const labelData: LabelData = {
    text: `${id}\n${nameElem.innerText.trim()}`,
    id,
    name: nameElem.innerText.trim(),
    urlBA: `https://brickarchitect.com/parts/${id}`,
    urlBL: cleanUrlBL,
    imgSrc: '',
    description: details.join('\n')
  };

  const btn = createPrintButton("Label", async () => {
    const printers = await dymoService.getPrinters();
    return dymoService.printLabel(printers[0].name, TEMPLATES[1], labelData);
  });
  
  nameElem.parentNode?.appendChild(btn);
  nameElem.dataset.dymoInjected = "true";
}

function initBrickArchitect() {
    // Single Page
    const h1 = document.querySelector('h1');
    if (h1 && !h1.dataset.dymoInjected && !window.location.pathname.includes('category-')) {
        const idMatch = h1.textContent?.match(/\(Part ([^\)]+)\)/);
        if (idMatch) {
            const id = idMatch[1];
            const name = h1.innerText.split('(')[0].trim();
            const img = document.querySelector('.partoverview img') as HTMLImageElement;
            const imgSrc = img ? img.src : '';

            const labelData: LabelData = {
                text: `${id}\n${name}`,
                id,
                name,
                urlBA: window.location.href,
                urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}#T=S&O={"iconly":0}`,
                imgSrc,
                description: "LEGO Part"
            };

            const btn = createPrintButton("Print", async () => {
                const printers = await dymoService.getPrinters();
                return dymoService.printLabel(printers[0].name, TEMPLATES[0], labelData);
            });
            h1.appendChild(btn);
            h1.dataset.dymoInjected = "true";
        }
    }

    // Category / Grid Cards
    const cards = document.querySelectorAll('.partcontainer');
    cards.forEach((card: any) => {
        if (card.dataset.dymoInjected) return;
        
        const link = card.closest('a') as HTMLAnchorElement;
        if (!link) return;

        const nameElem = card.querySelector('.partname');
        const numElem = card.querySelector('.partnum');
        const imgElem = card.querySelector('img');

        if (!numElem) return;

        const id = numElem.textContent?.trim() || '';
        const name = nameElem ? nameElem.textContent?.trim() : `Part ${id}`;
        const imgSrc = imgElem ? imgElem.src : '';

        const labelData: LabelData = {
            text: `${id}\n${name}`,
            id,
            name: name || '',
            urlBA: link.href,
            urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}#T=S&O={"iconly":0}`,
            imgSrc: imgSrc,
            description: "LEGO Part"
        };

        const btn = createPrintButton("", async () => {
            const printers = await dymoService.getPrinters();
            return dymoService.printLabel(printers[0].name, TEMPLATES[0], labelData);
        });
        btn.style.padding = "2px 6px";
        btn.style.fontSize = "10px";

        const textArea = card.querySelector('div[style*="display:flex"]') || card;
        textArea.appendChild(btn);
        card.dataset.dymoInjected = "true";
    });

    // Main Category H1
    if (h1 && !h1.dataset.dymoInjected && window.location.pathname.includes('category-')) {
        const name = h1.innerText.split('(')[0].trim();
        const summary = (document.querySelector('.category_summary') as HTMLElement)?.innerText.trim();
        // Added missing 'text' property to satisfy LabelData interface
        const labelData: LabelData = {
            text: `${name}\nLEGO Category`,
            id: name,
            name: "LEGO Category",
            description: summary || "Classic LEGO parts category",
            urlBA: window.location.href,
            urlBL: ""
        };
        const btn = createPrintButton("", async () => {
            const printers = await dymoService.getPrinters();
            return dymoService.printLabel(printers[0].name, TEMPLATES[2], labelData);
        });
        h1.appendChild(btn);
        h1.dataset.dymoInjected = "true";
    }

    // Subcategories H2/H3
    const subHeaders = document.querySelectorAll('.partcategoryname');
    subHeaders.forEach((header: any) => {
        if (header.dataset.dymoInjected) return;
        const link = header.querySelector('a');
        if (!link) return;

        const name = link.innerText.trim();
        const summaryElem = header.nextElementSibling as HTMLElement;
        let summary = "";
        if (summaryElem && (summaryElem.classList.contains('partcategorysummary') || summaryElem.classList.contains('category_summary'))) {
            summary = summaryElem.innerText.trim();
        }

        // Added missing 'text' property to satisfy LabelData interface
        const labelData: LabelData = {
            text: `${name}\nLEGO Category`,
            id: name,
            name: "LEGO Category",
            description: summary || "LEGO subcategory",
            urlBA: link.href,
            urlBL: ""
        };

        const btn = createPrintButton("", async () => {
            const printers = await dymoService.getPrinters();
            return dymoService.printLabel(printers[0].name, TEMPLATES[2], labelData);
        });
        btn.style.padding = "2px 6px";
        btn.style.fontSize = "10px";
        
        header.appendChild(btn);
        header.dataset.dymoInjected = "true";
    });
}

const observer = new MutationObserver(() => {
    const host = window.location.hostname;
    if (host.includes('bricklink.com')) initBrickLink();
    else if (host.includes('brickarchitect.com')) initBrickArchitect();
});

observer.observe(document.body, { childList: true, subtree: true });
