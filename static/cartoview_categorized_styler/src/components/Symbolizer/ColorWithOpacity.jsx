import { Component } from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

export default class ColorWithOpacity extends Component {
  render(){
    const {symbolizer, property, noLabel=false} = this.props;
    const color = symbolizer[property + "Color"]
    const alpha = parseFloat(symbolizer[property + "Opacity"] || 1) * 100;


    const onChange = (colors) => {
      symbolizer[property + "Color"] = colors.color;
      symbolizer[property + "Opacity"] = colors.alpha / 100;
      this.props.onChange(symbolizer);
    }


    const colorPicker = <ColorPicker color={color} alpha={alpha} onChange={onChange} className="color-with-opacity" />;
    if(noLabel){
      return colorPicker;
    }


    const label = property[0].toUpperCase() + property.slice(1);
    return(
      <div className="form-group">
        <label>{label} Color</label>
        <div>{colorPicker}</div>
      </div>
    )
  }
}
