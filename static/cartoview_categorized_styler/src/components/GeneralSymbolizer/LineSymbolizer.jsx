import { Component } from 'react';
import ColorSelector from "./ColorSelector.jsx";

import StylesManager from "../../managers/StylesManager.jsx";
import WMSClient from "../../gs-client/WMSClient.jsx";

export default class LineSymbolizer extends Component {
  render(){
    var {config, onChange} = this.props;
    return(
      <div>
        <div className="form-group">
          <label>Stroke Color</label><br></br>
          <ColorSelector config={config} property="stroke"
            onChange={newConfig => onChange(newConfig)} />
        </div>

        <div className="form-group">
          <label>Stroke Width</label>
          <input type="number" className="form-control"
            value={config.strokeWidth}
            step={1} min={0} max={10} style={{width:"80px"}}
            onChange={(e) => {
              const strokeWidth = parseInt(e.target.value);
              onChange({strokeWidth})
            }} />
        </div>
      </div>
    )
  }
}
