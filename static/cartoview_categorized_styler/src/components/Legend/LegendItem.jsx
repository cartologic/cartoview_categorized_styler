import React,{ Component } from 'react';

import LineLegendItem from "./LineLegendItem.jsx"
import PointLegendItem from "./PointLegendItem.jsx"
import PolygonLegendItem from "./PolygonLegendItem.jsx"

class LegendItem extends Component {
    render() {
        const { symbolizer } = this.props;
        if ( symbolizer.CLASS_NAME == "OpenLayers.Symbolizer.Point" ) {
            return <PointLegendItem {...this.props}/>
        } else if ( symbolizer.CLASS_NAME ==
            "OpenLayers.Symbolizer.Polygon" ) {
            return <PolygonLegendItem {...this.props}/>
        }
        return <LineLegendItem {...this.props}/>
    }
}
export default LegendItem
