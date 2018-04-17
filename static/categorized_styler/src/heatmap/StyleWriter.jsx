function xml(literalSections, ...substs) {
  // Use raw literal sections: we don’t want
  // backslashes (\n etc.) to be interpreted
  let raw = literalSections.raw;

  let result = '';

  substs.forEach((subst, i) => {
    // Retrieve the literal section preceding
    // the current substitution
    let lit = raw[i];

    // In the example, map() returns an array:
    // If substitution is an array (and not a string),
    // we turn it into a string
    if (Array.isArray(subst)) {
      subst = subst.join('');
    }

    // If the substitution is preceded by a dollar sign,
    // we escape special characters in it
    if (lit.endsWith('$')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst;
  });
  // Take care of last literal section
  // (Never fails, because an empty template string
  // produces one literal section, an empty string)
  result += raw[raw.length - 1]; // (A)

  return result;
}

var color1 = 'FF0000';
var color2 = '00FF00';

var getHex = (x) => {
  x = x.toString(16);
  return (x.length == 1)
    ? '0' + x
    : x;
};

const getColor = (color1, color2, ratio) => {
  const R1 = parseInt(color1.substring(1, 3), 16),
    G1 = parseInt(color1.substring(3, 5), 16),
    B1 = parseInt(color1.substring(5, 7), 16),
    R2 = parseInt(color2.substring(1, 3), 16),
    G2 = parseInt(color2.substring(3, 5), 16),
    B2 = parseInt(color2.substring(5, 7), 16),
    R = Math.ceil(R1 * ratio + R2 * (1 - ratio)),
    G = Math.ceil(G1 * ratio + G2 * (1 - ratio)),
    B = Math.ceil(B1 * ratio + B2 * (1 - ratio));
  return "#" + getHex(R) + getHex(G) + getHex(B);
}

const getColorMap = (startColor, endColor) => {
  const tpl = `<ColorMapEntry color="${startColor}" quantity=".2" label=""/>
<ColorMapEntry color="${getColor(startColor, endColor, .4)}" quantity=".4" label="" />
      <ColorMapEntry color="${getColor(startColor, endColor, .6)}" quantity=".6" label="" />
      <ColorMapEntry color="${getColor(startColor, endColor, .8)}" quantity=".8" label="" />
      <ColorMapEntry color="${endColor}" quantity="1.0" label="" />`
  return tpl;
}
const getWeightAttrXml = (weightAttr) => {
  if (weightAttr) {
    return `<ogc:Function name="parameter">
      <ogc:Literal>weightAttr</ogc:Literal>
      <ogc:Literal>${weightAttr}</ogc:Literal>
    </ogc:Function>`;
  }
  return "";
}
class StyleWriter {
  write(config) {
    return xml `<?xml version="1.0" encoding="ISO-8859-1"?>
    <StyledLayerDescriptor version="1.0.0"
      xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
      xmlns="http://www.opengis.net/sld"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <NamedLayer>
        <Name>${config.styleName}</Name>
        <UserStyle>
          <Name>${config.styleName}</Name>
        <Title>${config.title}</Title>
        <FeatureTypeStyle>
          <Transformation>
            <ogc:Function name="gs:Heatmap">
             <ogc:Function name="parameter">
               <ogc:Literal>data</ogc:Literal>
             </ogc:Function>
             ${getWeightAttrXml(config.attribute)}
             <ogc:Function name="parameter">
               <ogc:Literal>radiusPixels</ogc:Literal>
               <ogc:Function name="env">
                 <ogc:Literal>radius</ogc:Literal>
                 <ogc:Literal>${config.radius}</ogc:Literal>
               </ogc:Function>
             </ogc:Function>
             <ogc:Function name="parameter">
               <ogc:Literal>pixelsPerCell</ogc:Literal>
               <ogc:Literal>${config.pixelsPerCell}</ogc:Literal>
             </ogc:Function>
             <ogc:Function name="parameter">
               <ogc:Literal>outputBBOX</ogc:Literal>
               <ogc:Function name="env">
                 <ogc:Literal>wms_bbox</ogc:Literal>
               </ogc:Function>
             </ogc:Function>
             <ogc:Function name="parameter">
               <ogc:Literal>outputWidth</ogc:Literal>
               <ogc:Function name="env">
                 <ogc:Literal>wms_width</ogc:Literal>
               </ogc:Function>
             </ogc:Function>
             <ogc:Function name="parameter">
               <ogc:Literal>outputHeight</ogc:Literal>
               <ogc:Function name="env">
                 <ogc:Literal>wms_height</ogc:Literal>
               </ogc:Function>
             </ogc:Function>
            </ogc:Function>
          </Transformation>
          <Rule>
            <RasterSymbolizer>
            <!-- specify geometry attribute to pass validation -->
              <Geometry>
                <ogc:PropertyName>${config.geometryField}</ogc:PropertyName>
              </Geometry>
              <Opacity>0.6</Opacity>
              <ColorMap type="ramp" >
                <ColorMapEntry color="#FFFFFF" quantity="0" label="" opacity="0"/>
                <ColorMapEntry color="#FFFFFF" quantity="0.02" label="" opacity="0"/>
                ${getColorMap(config.startColor, config.endColor)}
              </ColorMap>
            </RasterSymbolizer>
           </Rule>
         </FeatureTypeStyle>
       </UserStyle>
     </NamedLayer>
    </StyledLayerDescriptor>`;
  }

}

export default new StyleWriter();
