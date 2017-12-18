import { Component } from 'react';
import ColorSelector from "./ColorSelector.jsx";
import LineSymbolizer from "./LineSymbolizer.jsx";

import StylesManager from "../../managers/StylesManager.jsx";
import WMSClient from "../../gs-client/WMSClient.jsx";


export default class PolygonSymbolizer extends Component {
  state = {}
  render(){
    var {config, onChange} = this.props;
    return(
      <div>
        <div className="form-group">
          <label>Fill Color</label>
          <ColorSelector config={config} property="fill"
            onChange={newConfig => onChange(newConfig)} />
        </div>
        <LineSymbolizer {...this.props} />
      </div>
    )
  }

}
