import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

class PointLegendItem extends Component {
  render(){
    const {symbolizer} = this.props;
    const  style = {
      backgroundColor: symbolizer.fillColor,
      color: symbolizer.fillColor,
      borderRight: 'none'
    }
    return <div ref="ct"></div>
  }
  componentDidMount(){
    this.olRenderer = new OpenLayers.Renderer.Canvas(ReactDOM.findDOMNode(this.refs.ct));
    this.feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0, 0));
    this.olRenderer.map = {
      getResolution: () => 1
    }
    this.setRendererDimensions(this.olRenderer, this.feature);
    const {symbolizer} = this.props;
    this.olRenderer.drawFeature(this.feature.clone(), symbolizer.clone())
  }
  setRendererDimensions() {
    const {symbolizer} = this.props;
    var w = symbolizer.pointRadius + 20;
    var halfW = w/2;
    var bounds = new OpenLayers.Bounds(- halfW, - halfW, halfW, halfW);
    this.olRenderer.setSize(new OpenLayers.Size(w, w));
    this.olRenderer.setExtent(bounds, true);
  }
}
export default PointLegendItem;
