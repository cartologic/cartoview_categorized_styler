import React, { Component } from 'react'

import ReactDOM from 'react-dom'
class LineLegendItem extends Component {
    render() {
        const { symbolizer } = this.props;
        const style = {
            backgroundColor: symbolizer.fillColor,
            color: symbolizer.fillColor,
            borderRight: 'none'
        }
        return <div ref="ct"></div>
    }
    componentDidMount() {
        this.olRenderer = new OpenLayers.Renderer.Canvas( ReactDOM.findDOMNode(
            this.refs.ct ) );
        this.feature = new OpenLayers.Feature.Vector( new OpenLayers.Geometry
            .LineString( [
      new OpenLayers.Geometry.Point( -8, -3 ),
      new OpenLayers.Geometry.Point( -3, 3 ),
      new OpenLayers.Geometry.Point( 3, -3 ),
      new OpenLayers.Geometry.Point( 8, 3 )
    ] ) );
        this.olRenderer.map = {
            getResolution: () => 1
        }
        this.setRendererDimensions( this.olRenderer, this.feature );
        const { symbolizer } = this.props;
        this.olRenderer.drawFeature( this.feature.clone(), symbolizer.clone() )
    }
    setRendererDimensions() {
        const { symbolizer } = this.props;
        var w = 22;
        var bounds = new OpenLayers.Bounds( -8, -8, 8, 8 );
        this.olRenderer.setSize( new OpenLayers.Size( w, w ) );
        this.olRenderer.setExtent( bounds, true );
    }
}
export default LineLegendItem;
