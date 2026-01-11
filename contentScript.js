/**
 * Standalone Content Script for Gemini Label Studio
 * Supports both BrickLink and BrickArchitect (Single Parts & Categories)
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

const CATEGORY_XML_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<DesktopLabel Version="1">
  <DYMOLabel Version="4">
    <Description>LEGO Category Label</Description>
    <Orientation>Portrait</Orientation>
    <LabelName>S0722540 multipurpose</LabelName>
    <InitialLength>0</InitialLength>
    <BorderStyle>SolidLine</BorderStyle>
    ${XML_METADATA}
    <DynamicLayoutManager>
      <RotationBehavior>ClearObjects</RotationBehavior>
      <LabelObjects>
        <TextObject>
          <Name>Title</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><FitMode>AlwaysFit</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_ID}</Text>${FONT_INFO('14', true)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.1</X><Y>0.05</Y></DYMOPoint><Size><Width>1.4</Width><Height>0.3</Height></Size></ObjectLayout>
        </TextObject>
        <TextObject>
          <Name>Desc</Name>
          ${BRUSHES_TRANS}
          ${STANDARD_PROPS}
          <HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><FitMode>None</FitMode><IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>None</FitMode><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><IsVertical>False</IsVertical>
            <LineTextSpan><TextSpan><Text>{PART_DESC}</Text>${FONT_INFO('7', false)}</TextSpan></LineTextSpan>
          </FormattedText>
          <ObjectLayout><DYMOPoint><X>0.1</X><Y>0.35</Y></DYMOPoint><Size><Width>1.4</Width><Height>0.75</Height></Size></ObjectLayout>
        </TextObject>
        <QRCodeObject>
          <Name>QR</Name>
          ${BRUSHES_STATIC}
          ${STANDARD_PROPS}
          <BarcodeFormat>QRCode</BarcodeFormat>
          <Data><DataString>{URL_BA}</DataString></Data>
          <HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><Size>AutoFit</Size>
          <EQRCodeType>QRCodeText</EQRCodeType><TextDataHolder><Value>{URL_BA}</Value></TextDataHolder>
          <ObjectLayout><DYMOPoint><X>1.5</X><Y>0.5</Y></DYMOPoint><Size><Width>0.6</Width><Height>0.6</Height></Size></ObjectLayout>
        </QRCodeObject>
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
  
  try {
    const response = await fetch(finalUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
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
        img.src = reader.result;
      };
      reader.readAsDataURL(blob);
    });
  } catch (e) {
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
      img.onerror = () => resolve("");
      img.src = finalUrl;
    });
  }
}

/**
 * Updated printLabel to handle category template
 * type: 'part' | 'optimized' | 'category'
 */
async function printLabel(printerName, labelData, type = 'part') {
  let xml = BRICK_PART_LABEL_XML;
  if (type === 'optimized') xml = BRICKLINK_OPTIMIZED_XML;
  if (type === 'category') xml = CATEGORY_XML_TEMPLATE;

  const esc = (s) => (s || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  xml = xml.replace(/{PART_ID}/g, esc(labelData.id));
  xml = xml.replace(/{PART_NAME}/g, esc(labelData.name).substring(0, 45));
  xml = xml.replace(/{PART_DESC}/g, wrapText(labelData.description || "LEGO Item", 25));
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

function createBtn(data, type = 'part') {
  const btn = document.createElement('button');
  btn.innerText = "🖨️";
  btn.style.cssText = STYLE;
  btn.onclick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const orig = btn.innerText; btn.innerText = "..."; btn.disabled = true;
    const printer = await getFirstPrinter();
    if (!printer) { alert("DYMO Connect not running."); btn.innerText = orig; btn.disabled = false; return; }
    const ok = await printLabel(printer, data, type);
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
        let typeKey = "P";
        if (idS) typeKey = "S";
        if (idM) typeKey = "M";

        let imgSrc = document.getElementById('_idImageMain')?.src || document.getElementById('img-viewer-main-img')?.src;
        if (!imgSrc || imgSrc.includes('transparent.png')) {
             imgSrc = document.querySelector('.pciImageMain')?.src || document.querySelector('meta[property="og:image"]')?.content;
        }
        if (imgSrc && imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;

        const data = {
            id,
            name: nameElem.innerText.trim(),
            urlBA: `https://brickarchitect.com/parts/${id}`,
            urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?${typeKey}=${id}#T=S&O={"iconly":0}`,
            imgSrc: imgSrc || '',
            description: "LEGO Item"
        };
        nameElem.appendChild(createBtn(data, 'optimized'));
        nameElem.dataset.injected = "true";
    }
}

function runBrickArchitect() {
    // 1. Single part page: /parts/3005
    const singlePartH1 = document.querySelector('h1');
    if (singlePartH1 && !singlePartH1.dataset.injected && window.location.pathname.match(/\/parts\/([^\/\?]+)/) && !window.location.pathname.includes('category-')) {
        const idMatch = singlePartH1.innerText.match(/\(Part ([^\)]+)\)/);
        const id = idMatch ? idMatch[1] : window.location.pathname.split('/').filter(x => x).pop();
        
        let imgSrc = document.querySelector('.partoverview img')?.src || 
                    document.querySelector('img[src*="/parts-large/"]')?.src;
        
        if (imgSrc && imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;

        const data = {
            id,
            name: singlePartH1.innerText.split('(')[0].trim(),
            urlBA: window.location.href,
            urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}#T=S&O={"iconly":0}`,
            imgSrc: imgSrc || '',
            description: "LEGO Part"
        };
        singlePartH1.appendChild(createBtn(data, 'part'));
        singlePartH1.dataset.injected = "true";
    }

    // 2. Category / Search results with .partcontainer
    const cards = document.querySelectorAll('.partcontainer');
    cards.forEach(card => {
        if (card.dataset.injected) return;
        
        const link = card.closest('a');
        if (!link) return;

        const nameElem = card.querySelector('.partname');
        const numElem = card.querySelector('.partnum');
        const imgElem = card.querySelector('img');

        if (!numElem) return;

        const id = numElem.innerText.trim();
        const name = nameElem ? nameElem.innerText.trim() : `Part ${id}`;
        const imgSrc = imgElem ? imgElem.src : '';

        const data = {
            id,
            name,
            urlBA: link.href,
            urlBL: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}#T=S&O={"iconly":0}`,
            imgSrc,
            description: "LEGO Part"
        };

        const btn = createBtn(data, 'part');
        const textArea = card.querySelector('div[style*="display:flex"]') || card;
        textArea.appendChild(btn);
        card.dataset.injected = "true";
    });

    // 3. Category Headers (H1, H2, H3)
    // Main H1 Category
    const mainH1 = document.querySelector('h1');
    if (mainH1 && !mainH1.dataset.injected && window.location.pathname.includes('category-')) {
        const name = mainH1.innerText.split('(')[0].trim();
        const summary = document.querySelector('.category_summary')?.innerText.trim();
        const idMatch = window.location.pathname.match(/category-(\d+)/);
        const id = idMatch ? `Category ${idMatch[1]}` : name;

        const data = {
            id: name,
            name: "LEGO Category",
            description: summary || "Classic LEGO parts category",
            urlBA: window.location.href,
            urlBL: ""
        };
        mainH1.appendChild(createBtn(data, 'category'));
        mainH1.dataset.injected = "true";
    }

    // Subcategory headers (H2, H3)
    const subHeaders = document.querySelectorAll('.partcategoryname');
    subHeaders.forEach(header => {
        if (header.dataset.injected) return;
        
        const link = header.querySelector('a');
        if (!link) return;

        const name = link.innerText.trim();
        const summaryElem = header.nextElementSibling;
        let summary = "";
        if (summaryElem && (summaryElem.classList.contains('partcategorysummary') || summaryElem.classList.contains('category_summary'))) {
            summary = summaryElem.innerText.trim();
        }

        const data = {
            id: name,
            name: "LEGO Category",
            description: summary || "LEGO subcategory",
            urlBA: link.href,
            urlBL: ""
        };

        header.appendChild(createBtn(data, 'category'));
        header.dataset.injected = "true";
    });
}

setInterval(() => {
    const host = window.location.hostname;
    if (host.includes('bricklink.com')) runBrickLink();
    else if (host.includes('brickarchitect.com')) runBrickArchitect();
}, 2000);
