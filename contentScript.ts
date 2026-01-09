
import { dymoService } from './services/dymoService';
import { TEMPLATES } from './constants';
import { LabelData } from './types';

const BUTTON_STYLE = `margin-left:10px;background-color:#10b981;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;vertical-align:middle;box-shadow:0 1px 2px rgba(0,0,0,0.1);transition:all 0.2s;font-family:system-ui,-apple-system,sans-serif;`;

function createPrintButton(text: string, onPrint: () => Promise<boolean>) {
  const btn = document.createElement('button');
  btn.innerText = `🖨️ ${text}`;
  btn.style.cssText = BUTTON_STYLE;
  btn.onclick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const orig = btn.innerText; btn.innerText = "⏳ Processing..."; btn.disabled = true;
    try {
      const printers = await dymoService.getPrinters();
      if (!printers.length) { alert("DYMO Service not found."); btn.innerText = orig; btn.disabled = false; return; }
      const success = await onPrint();
      btn.innerText = success ? "✅ Printed" : "❌ Error";
      setTimeout(() => { btn.innerText = orig; btn.disabled = false; }, 2000);
    } catch (err) { btn.innerText = "❌ Failed"; btn.disabled = false; }
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
  if (idS) details.push("LEGO Set");
  else if (idM) details.push("LEGO Minifigure");
  else details.push("LEGO Part");

  // Theme / Subtheme
  const catLinks = Array.from(document.querySelectorAll('a[href*="catString="]'));
  if (catLinks.length > 0) {
    details.push(`Theme: ${catLinks[0].textContent?.trim()}`);
    if (catLinks.length > 1) {
      details.push(`Sub: ${catLinks[1].textContent?.trim()}`);
    }
  } else {
    const cat = (document.querySelector('font[color="#777777"] b')?.textContent || document.querySelector('.pc-category b')?.textContent);
    if (cat) details.push(`Category: ${cat.trim()}`);
  }

  // Year
  let yearText = "";
  const yearSpan = document.getElementById('yearReleasedSec');
  if (yearSpan) {
    yearText = yearSpan.textContent?.trim() || "";
  } else {
    const yearLink = Array.from(document.querySelectorAll('a.links')).find(a => (a as HTMLAnchorElement).href.includes('itemYear='));
    if (yearLink) {
      yearText = yearLink.textContent?.trim() || "";
    } else {
      const yearRow = Array.from(document.querySelectorAll('td')).find(t => t.textContent?.includes('Year Released:'));
      if (yearRow) yearText = yearRow.nextElementSibling?.textContent?.trim() || "";
    }
  }
  if (yearText) details.push(`Year: ${yearText}`);

  // Parts
  const invLink = Array.from(document.querySelectorAll('a.links')).find(a => (a as HTMLAnchorElement).href.includes('catalogItemInv.asp') && !(a as HTMLAnchorElement).href.includes('viewItemType=M'));
  if (invLink) {
    details.push(`Parts: ${invLink.textContent?.trim().split(' ')[0]}`);
  }

  // Relations
  if (idM) {
    const setsLink = Array.from(document.querySelectorAll('a.links')).find(a => (a as HTMLAnchorElement).href.includes('catalogItemIn.asp'));
    if (setsLink) details.push(`In ${setsLink.textContent?.trim().split(' ')[0]} Sets`);
  } else if (idS) {
    const miniLink = Array.from(document.querySelectorAll('a.links')).find(a => (a as HTMLAnchorElement).href.includes('catalogItemInv.asp') && (a as HTMLAnchorElement).href.includes('viewItemType=M'));
    if (miniLink) details.push(`Minifigs: ${miniLink.textContent?.trim().split(' ')[0]}`);
  }

  // Image
  let imgSrc = (document.getElementById('_idImageMain') as HTMLImageElement)?.src || 
               (document.getElementById('img-viewer-main-img') as HTMLImageElement)?.src;
  
  if (!imgSrc || imgSrc.includes('transparent.png')) {
      imgSrc = (document.querySelector('.pciImageMain') as HTMLImageElement)?.src
            || (document.querySelector('.id-main-item-image') as HTMLImageElement)?.src 
            || (document.querySelector('.main-item-image') as HTMLImageElement)?.src
            || (document.querySelector('meta[property="og:image"]') as HTMLMetaElement)?.content;
  }
  
  if (imgSrc && imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;

  const labelData: LabelData = {
    text: `${id}\n${nameElem.innerText.trim()}`,
    id,
    name: nameElem.innerText.trim(),
    urlBA: `https://brickarchitect.com/parts/${id}`,
    urlBL: window.location.href,
    imgSrc: imgSrc || '',
    description: details.join('\n')
  };

  const btn = createPrintButton("Label", async () => {
    const printers = await dymoService.getPrinters();
    return dymoService.printLabel(printers[0].name, TEMPLATES[1], labelData);
  });
  
  nameElem.parentNode?.appendChild(btn);
  nameElem.dataset.dymoInjected = "true";
}

const observer = new MutationObserver(() => {
  if (window.location.hostname.includes('bricklink.com')) initBrickLink();
});
observer.observe(document.body, { childList: true, subtree: true });
initBrickLink();
