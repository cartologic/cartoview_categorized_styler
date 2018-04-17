import { Component } from 'react';
import PointSymbolizer from "./PointSymbolizer.jsx"
import LineSymbolizer from "./LineSymbolizer.jsx"
import PolygonSymbolizer from "./PolygonSymbolizer.jsx"

export default class Symbolizer extends Component {
  getSymbolizer(symbolizer){
    if(symbolizer.CLASS_NAME == "OpenLayers.Symbolizer.Point"){
      return <PointSymbolizer symbolizer={symbolizer} onChange={s => this.onSymbolizerChange(s)}/>
    }
    else if(symbolizer.CLASS_NAME == "OpenLayers.Symbolizer.Polygon"){
      return <PolygonSymbolizer symbolizer={symbolizer} onChange={s => this.onSymbolizerChange(s)}/>
    }
    return <LineSymbolizer symbolizer={symbolizer} onChange={s => this.onSymbolizerChange(s)}/>
  }


  onSymbolizerChange(s) {
    const {rule, onChange} = this.props;
    rule.symbolizers[0] = s;
    onChange(rule.clone())
  }


  render(){
    const {rule, onChange} = this.props;

    return(
      <div>
        <div className="form-group">
          <label>Legend Label</label>
          <input className="form-control" value={rule.title}
            onChange={(e) => {
                rule.title = e.target.value;
                onChange(rule.clone())
              }
            }/>
        </div>
        {this.getSymbolizer(rule.symbolizers[0])}
      </div>
    )
  }
}
