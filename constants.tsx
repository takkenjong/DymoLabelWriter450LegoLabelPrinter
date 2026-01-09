import { LabelTemplate } from './types';

/**
 * MANDATORY BRUSH FRAGMENTS
 * These are verbose to ensure the DYMO service can instantiate all required .NET objects.
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

const FONT_INFO = (size: string, bold: boolean = false) => `
<FontInfo>
  <FontName>Segoe UI</FontName>
  <FontSize>${size}</FontSize>
  <IsBold>${bold ? 'True' : 'False'}</IsBold>
  <IsItalic>False</IsItalic>
  <IsUnderline>False</IsUnderline>
  <FontBrush><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></FontBrush>
</FontInfo>`;

/**
 * MANDATORY XML HEADER ELEMENTS
 * The order of these elements is CRITICAL to avoid HTTP 400 errors.
 * DYMORect MUST come before BorderColor.
 */
const XML_METADATA = `
    <DYMORect><DYMOPoint><X>0.04</X><Y>0.06</Y></DYMOPoint><Size><Width>2.17</Width><Height>1.13</Height></Size></DYMORect>
    <BorderColor><SolidColorBrush><Color A="1" R="0" G="0" B="0"></Color></SolidColorBrush></BorderColor>
    <BorderThickness>1</BorderThickness>
    <Show_Border>False</Show_Border>
    <HasFixedLength>False</HasFixedLength>
    <FixedLengthValue>0</FixedLengthValue>`;

// --- TEMPLATE 1: BRICK ARCHITECT PART (DUAL QR LINED OUT) ---
export const BRICK_PART_LABEL_XML = `<?xml version="1.0" encoding="utf-8"?>
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
    <DynamicLayoutManager>
      <RotationBehavior>ClearObjects</RotationBehavior>
      <LabelObjects>
      </LabelObjects>
    </DynamicLayoutManager>
    <DataTable><Columns></Columns><Rows></Rows></DataTable>
  </DYMOLabel>
</DesktopLabel>`;

// --- TEMPLATE 2: BRICKLINK OPTIMIZED ---
export const BRICKLINK_PART_LABEL_XML = `<?xml version="1.0" encoding="utf-8"?>
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
          <ObjectLayout><DYMOPoint><X>0.79</X><Y>0.55</Y></DYMOPoint><Size><Width>0.67</Width><Height>0.63</Height></Size></ObjectLayout>
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

// --- TEMPLATE 3: CATEGORY ---
export const CATEGORY_XML_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
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

export const TEMPLATES: LabelTemplate[] = [
  {
    id: 'lego-part-adv',
    name: 'BrickArchitect Part (Dual QR)',
    description: 'Advanced layout with Image, BA and BL QR codes.',
    xml: BRICK_PART_LABEL_XML
  },
  {
    id: 'bricklink-part-adv',
    name: 'BrickLink Optimized (Info Block)',
    description: 'Single QR, Image, and detailed part information block.',
    xml: BRICKLINK_PART_LABEL_XML
  },
  {
    id: 'lego-category-adv',
    name: 'LEGO Category',
    description: 'Designed for drawer fronts with wrapped descriptions.',
    xml: CATEGORY_XML_TEMPLATE,
    isCategory: true
  }
];