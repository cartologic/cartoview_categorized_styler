import { Component } from 'react';
import {  FormGroup,  Input } from 'reactstrap';
import PolygonSymbolizer from './PolygonSymbolizer.jsx';

class PointSymbolizer extends Component {
  render(){
    const {symbolizer} = this.props;

    const onChange = (name, e, isNum) => {
      if(e.target.value){
        symbolizer[name] = isNum ? parseFloat(e.target.value) : e.target.value;
        this.props.onChange(symbolizer);
      }
    }
    return <div>
      <FormGroup>
        <label>Symbol</label>
        <Input type="select" value={symbolizer.graphicName} onChange={e => onChange("graphicName", e)}>
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="star">Star</option>
          <option value="x">X</option>
          <option value="cross">Cross</option>
          <option value="triangle">Triangle</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <label>Point Radius</label>
        <Input type="number" value={symbolizer.pointRadius}
          step={1} min={0} max={50}
          onChange={(e) => onChange("pointRadius", e, true)}/>
      </FormGroup>
      <PolygonSymbolizer symbolizer={symbolizer} onChange={this.props.onChange} />
    </div>
  }
}
export default PointSymbolizer;
// TODO: Support
// rotation
// strokeLinecap	{String} Stroke cap type (“butt”, “round”, or “square”).
// externalGraphic	{String} Url to an external graphic that will be used for rendering points.
// graphicWidth	{Number} Pixel width for sizing an external graphic.
// graphicHeight	{Number} Pixel height for sizing an external graphic.
// graphicOpacity	{Number} Opacity (0-1) for an external graphic.
// graphicXOffset	{Number} Pixel offset along the positive x axis for displacing an external graphic.
// graphicYOffset	{Number} Pixel offset along the positive y axis for displacing an external graphic.
