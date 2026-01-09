/**
 * Standalone Content Script for Gemini Label Studio
 * Synchronized with the latest templates from constants.tsx
 */

const BRUSHES_STATIC = `<Brushes>
  <BackgroundBrush><SolidColorBrush><Color A="1" R="1" G="1" B="1"></Color></SolidColorBrush></BackgroundBrush>
  <BorderBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></BorderBrush>
  <StrokeBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></StrokeBrush>
  <FillBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></FillBrush>
</Brushes>`;

const BRUSHES_TRANS = `<Brushes>
  <BackgroundBrush><SolidColorBrush><Color A="0" R="0" G="0" B="0"></Color></SolidColorBrush></BackgroundBrush>
  <BorderBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></BorderBrush>
  <StrokeBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></StrokeBrush>
  <FillBrush><SolidColorBrush><Color A="0" R="0" G="0" B="0"></Color></SolidColorBrush></FillBrush>
</Brushes>`;

const STANDARD_PROPS = `
<Rotation>Rotation0</Rotation>
<OutlineThickness>1</OutlineThickness>
<IsOutlined>False</IsOutlined>
<BorderStyle>SolidLine</BorderStyle>
<Margin><DYMOThickness Left="0" Top="0" Right="0" Bottom="0" /></Margin>`;

const FONT_INFO = (size, bold = false) => `
<FontInfo>
  <FontName>Segoe UI</FontName>
  <FontSize>${size}</FontSize>
  <IsBold>${bold ? 'True' : 'False'}</IsBold>
  <IsItalic>False</IsItalic>
  <IsUnderline>False</IsUnderline>
  <FontBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></FontBrush>
</FontInfo>`;

const XML_METADATA = `
    <DYMORect><DYMOPoint><X>0.04</X><Y>0.06</Y></DYMOPoint><Size><Width>2.17</Width><Height>1.13</Height></Size></DYMORect>
    <BorderColor><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></BorderColor>
    <BorderThickness>1</BorderThickness>
    <Show_Border>False</Show_Border>
    <HasFixedLength>False</HasFixedLength>
    <FixedLengthValue>0</FixedLengthValue>`;

const BRICKLINK_OPTIMIZED_XML = `<?xml version="1.0" encoding="utf-8"?>
<DesktopLabel Version="1">
  <DYMOLabel Version="4">
    <Description>BrickLink Optimized Label</Description>
    <Orientation>Portrait</Orientation>
    <LabelName>S0722540 multipurpose</LabelName>
    <InitialLength>0</InitialLength>
    <BorderStyle>SolidLine</BorderStyle>
    ${XML_METADATA}
    <DynamicLayoutManager>
      <RotationBehavior>ClearObjects</RotationBehavior>
      <LabelObjects>
        <QRCodeObject>
          <Name>BL-URL</Name>
          ${BRUSHES_STATIC}
          ${STANDARD_PROPS}
          <BarcodeFormat>QRCode</BarcodeFormat>
          <Data><DataString>{URL_BL}</DataString></Data>
          <HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><Size>AutoFit</Size>
          <EQRCodeType>QRCodeText</EQRCodeType><TextDataHolder><Value>{URL_BL}</Value></TextDataHolder>
          <ObjectLayout><DYMOPoint><X>1.42</X><Y>0.36</Y></DYMOPoint><Size><Width>0.78</Width><Height>0.70</Height></Size></ObjectLayout>
        </QRCodeObject>
        <TextObject>
          <Name>ID</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_ID}</Text>${FONT_INFO('15.7', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.14</X><Y>0.06</Y></DYMOPoint><Size><Width>1.31</Width><Height>0.29</Height></Size></ObjectLayout>
        </TextObject>
        <TextObject>
          <Name>Title</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_NAME}</Text>${FONT_INFO('5.1', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.14</X><Y>0.36</Y></DYMOPoint><Size><Width>1.33</Width><Height>0.19</Height></Size></ObjectLayout>
        </TextObject>
        <TextObject>
          <Name>BL-INDICATOR</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>BL</Text>${FONT_INFO('13.9', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>1.44</X><Y>0.10</Y></DYMOPoint><Size><Width>0.73</Width><Height>0.26</Height></Size></ObjectLayout>
        </TextObject>
        <TextObject>
          <Name>BL-INFO</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><FitMode>None</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>None</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_DESC}</Text>${FONT_INFO('5', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.75</X><Y>0.55</Y></DYMOPoint><Size><Width>0.7</Width><Height>0.63</Height></Size></ObjectLayout>
        </TextObject>
        <ImageObject>
          <Name>BL-Image</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <Data>{IMG_DATA}</Data><ScaleMode>Uniform</ScaleMode>
          <HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment>
          <ObjectLayout><DYMOPoint><X>0.14</X><Y>0.55</Y></DYMOPoint><Size><Width>0.57</Width><Height>0.58</Height></Size></ObjectLayout>
        </ImageObject>
      </LabelObjects>
    </DynamicLayoutManager>
    <DataTable><Columns></Columns><Rows></Rows></DataTable>
  </DYMOLabel>
</DesktopLabel>`;

const BRICK_PART_LABEL_XML = `<?xml version="1.0" encoding="utf-8"?>
<DesktopLabel Version="1">
  <DYMOLabel Version="4">
    <Description>LEGO Part Label Dual QR</Description>
    <Orientation>Portrait</Orientation>
    <LabelName>S0722540 multipurpose</LabelName>
    <InitialLength>0</InitialLength>
    <BorderStyle>SolidLine</BorderStyle>
    ${XML_METADATA}
    <DynamicLayoutManager>
      <RotationBehavior>ClearObjects</RotationBehavior>
      <LabelObjects>
        <QRCodeObject>
          <Name>QR_BL</Name>
          ${BRUSHES_STATIC}
          ${STANDARD_PROPS}
          <BarcodeFormat>QRCode</BarcodeFormat>
          <Data><DataString>{URL_BL}</DataString></Data>
          <HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><Size>AutoFit</Size>
          <EQRCodeType>QRCodeText</EQRCodeType><TextDataHolder><Value>{URL_BL}</Value></TextDataHolder>
          <ObjectLayout><DYMOPoint><X>1.62</X><Y>0.12</Y></DYMOPoint><Size><Width>0.45</Width><Height>0.45</Height></Size></ObjectLayout>
        </QRCodeObject>
        <TextObject>
          <Name>Label_BL</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Right</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Right</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>BL</Text>${FONT_INFO('9', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>1.35</X><Y>0.24</Y></DYMOPoint><Size><Width>0.25</Width><Height>0.20</Height></Size></ObjectLayout>
        </TextObject>
        <QRCodeObject>
          <Name>QR_BA</Name>
          ${BRUSHES_STATIC}
          ${STANDARD_PROPS}
          <BarcodeFormat>QRCode</BarcodeFormat>
          <Data><DataString>{URL_BA}</DataString></Data>
          <HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><Size>AutoFit</Size>
          <EQRCodeType>QRCodeText</EQRCodeType><TextDataHolder><Value>{URL_BA}</Value></TextDataHolder>
          <ObjectLayout><DYMOPoint><X>1.62</X><Y>0.69</Y></DYMOPoint><Size><Width>0.45</Width><Height>0.45</Height></Size></ObjectLayout>
        </QRCodeObject>
        <TextObject>
          <Name>Label_BA</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Right</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Right</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>BA</Text>${FONT_INFO('9', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>1.35</X><Y>0.81</Y></DYMOPoint><Size><Width>0.25</Width><Height>0.20</Height></Size></ObjectLayout>
        </TextObject>
        <TextObject>
          <Name>ID</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_ID}</Text>${FONT_INFO('18', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.1</X><Y>0.05</Y></DYMOPoint><Size><Width>1.2</Width><Height>0.35</Height></Size></ObjectLayout>
        </TextObject>
        <TextObject>
          <Name>Name</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_NAME}</Text>${FONT_INFO('7', false)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.1</X><Y>0.40</Y></DYMOPoint><Size><Width>1.2</Width><Height>0.2</Height></Size></ObjectLayout>
        </TextObject>
        <ImageObject>
          <Name>IMG</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <Data>{IMG_DATA}</Data><ScaleMode>Uniform</ScaleMode>
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment>
          <ObjectLayout><DYMOPoint><X>0.1</X><Y>0.62</Y></DYMOPoint><Size><Width>1.2</Width><Height>0.48</Height></Size></ObjectLayout>
        </ImageObject>
      </LabelObjects>
    </DynamicLayoutManager>
    <DataTable><Columns></Columns><Rows></Rows></DataTable>
  </DYMOLabel>
</DesktopLabel>`;

const DYMO_URL = "https://localhost:41951";

function wrapText(str, maxChars) {
    if (!str) return "";
    const escaped = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const sections = escaped.split(/\n|\r/);
    const finalLines = [];

    sections.forEach(section => {
      let words = section.trim().split(' ');
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

async function getResizedBase64(url) {
  if (!url) return "";
  let finalUrl = url;
  if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 250;
      let w = img.width, h = img.height;
      if (w > h) { if (w > maxSize) { h *= maxSize / w; w = maxSize; } }
      else { if (h > maxSize) { w *= maxSize / h; h = maxSize; } }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.onerror = () => {
        console.warn("Failed to load image for base64 conversion:", finalUrl);
        resolve("");
    };
    img.src = finalUrl;
  });
}

async function printLabel(printerName, labelData, isOptimized = false) {
  let xml = isOptimized ? BRICKLINK_OPTIMIZED_XML : BRICK_PART_LABEL_XML;
  const esc = (s) => (s || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  xml = xml.replace(/{PART_ID}/g, esc(labelData.id));
  xml = xml.replace(/{PART_NAME}/g, esc(labelData.name).substring(0, 45));
  xml = xml.replace(/{PART_DESC}/g, wrapText(labelData.description || "LEGO Item", 22));
  xml = xml.replace(/{URL_BA}/g, esc(labelData.urlBA));
  xml = xml.replace(/{URL_BL}/g, esc(labelData.urlBL));

  if (xml.includes('{IMG_DATA}')) {
    const imgBase64 = await getResizedBase64(labelData.imgSrc);
    xml = xml.replace(/{IMG_DATA}/g, imgBase64 || "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
  }

  const params = new URLSearchParams();
  params.append('printerName', printerName);
  params.append('printParamsXml', '<LabelWriterPrintParams><PaperName>S0722540</PaperName></LabelWriterPrintParams>');
  params.append('labelXml', xml);
  params.append('labelSetXml', '');

  try {
    const response = await fetch(`${DYMO_URL}/DYMO/DLS/Printing/PrintLabel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    return response.ok;
  } catch (e) {
    return false;
  }
}

async function getFirstPrinter() {
  try {
    const res = await fetch(`${DYMO_URL}/api/addin/get-printers`);
    const data = await res.json();
    const list = data.responseValue || data;
    return list[0]?.name || null;
  } catch (e) { return null; }
}

const STYLE = `background-color:#10b981;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:700;margin-left:4px;display:inline-block;box-shadow:0 1px 2px rgba(0,0,0,0.2);transition:all 0.2s;vertical-align:middle;line-height:1.2;z-index:9999;`;

function createBtn(data, isOptimized = false) {
  const btn = document.createElement('button');
  btn.innerText = "🖨️";
  btn.style.cssText = STYLE;
  btn.onclick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const orig = btn.innerText; btn.innerText = "..."; btn.disabled = true;
    const printer = await getFirstPrinter();
    if (!printer) { alert("DYMO Connect not running."); btn.innerText = orig; btn.disabled = false; return; }
    const ok = await printLabel(printer, data, isOptimized);
    btn.innerText = ok ? "✅" : "❌";
    setTimeout(() => { btn.innerText = orig; btn.disabled = false; }, 2000);
  };
  return btn;
}

function runBrickLink() {
    const params = new URLSearchParams(window.location.search);
    const idP = params.get('P')?.split('__')[0];
    const idS = params.get('S')?.split('__')[0];
    const idM = params.get('M')?.split('__')[0];
    const id = idP || idS || idM;
    if (!id) return;
    
    const nameElem = document.getElementById('item-name-title');
    if (nameElem && !nameElem.dataset.injected) {
        let type = "LEGO Part";
        if (idS) type = "LEGO Set";
        if (idM) type = "LEGO Minifigure";

        let details = [type];
        
        // 1. Theme / Subtheme scraping (using catString breadcrumb pattern)
        const catLinks = Array.from(document.querySelectorAll('a[href*="catString="]'));
        if (catLinks.length > 0) {
            const theme = catLinks[0].innerText.trim();
            details.push(`Theme: ${theme}`);
            if (catLinks.length > 1) {
                const subtheme = catLinks[1].innerText.trim();
                details.push(`Sub: ${subtheme}`);
            }
        } else {
            // Fallback to older category style if breadcrumbs not found
            const cat = document.querySelector('font[color="#777777"] b')?.innerText || document.querySelector('.pc-category b')?.innerText;
            if (cat) details.push(`Category: ${cat.trim()}`);
        }
        
        // 2. Year scraping (Enhanced)
        let yearText = "";
        const yearSpan = document.getElementById('yearReleasedSec');
        if (yearSpan) {
            yearText = yearSpan.innerText.trim();
        } else {
            const yearLink = Array.from(document.querySelectorAll('a.links')).find(a => a.href.includes('itemYear='));
            if (yearLink) {
                yearText = yearLink.innerText.trim();
            } else {
                const yearRow = Array.from(document.querySelectorAll('td')).find(t => t.innerText.includes('Released:') || t.innerText.includes('Year Released:'));
                if (yearRow) yearText = yearRow.nextElementSibling?.innerText.trim();
            }
        }
        if (yearText) details.push(`Year: ${yearText}`);

        // 3. Parts / Piece count scraping
        const invLink = Array.from(document.querySelectorAll('a.links')).find(a => a.href.includes('catalogItemInv.asp') && !a.href.includes('viewItemType=M'));
        if (invLink) {
            const partCountStr = invLink.innerText.trim();
            details.push(`Parts: ${partCountStr.split(' ')[0]}`);
        } else {
            const consistsRow = Array.from(document.querySelectorAll('td')).find(t => t.innerText.includes('Item Consists Of'));
            if (consistsRow) {
                const consistsText = consistsRow.nextElementSibling?.innerText.trim();
                if (consistsText) details.push(`Pcs: ${consistsText.split(' ')[0]}`);
            }
        }

        // 4. Minifigure / Sets "In" count
        if (idM) {
            const setsLink = Array.from(document.querySelectorAll('a.links')).find(a => a.href.includes('catalogItemIn.asp'));
            if (setsLink) {
                const count = setsLink.innerText.trim().split(' ')[0];
                details.push(`In ${count} Sets`);
            }
        } else if (idS) {
            const miniLink = Array.from(document.querySelectorAll('a.links')).find(a => a.href.includes('catalogItemInv.asp') && a.href.includes('viewItemType=M'));
            if (miniLink) {
                const count = miniLink.innerText.trim().split(' ')[0];
                details.push(`Minifigs: ${count}`);
            }
        }

        // 5. Image selector logic (Robust selectors)
        let imgSrc = document.getElementById('_idImageMain')?.src 
                   || document.getElementById('img-viewer-main-img')?.src;
        
        if (!imgSrc || imgSrc.includes('transparent.png')) {
             imgSrc = document.querySelector('.pciImageMain')?.src
                   || document.querySelector('.id-main-item-image')?.src 
                   || document.querySelector('.main-item-image')?.src
                   || document.querySelector('meta[property="og:image"]')?.content;
        }
        
        // Protocol fix for relative URLs
        if (imgSrc && imgSrc.startsWith('//')) {
          imgSrc = 'https:' + imgSrc;
        }

        const data = {
            id,
            name: nameElem.innerText.trim(),
            urlBA: `https://brickarchitect.com/parts/${id}`,
            urlBL: window.location.href,
            imgSrc: imgSrc || '',
            description: details.join('\n')
        };
        nameElem.appendChild(createBtn(data, true));
        nameElem.dataset.injected = "true";
    }
}

setInterval(() => {
    if (window.location.hostname.includes('bricklink.com')) runBrickLink();
}, 2000);
