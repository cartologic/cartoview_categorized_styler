import React, { Component } from 'react'

import ColorSelector from "./ColorSelector.jsx"
import LineSymbolizer from "./LineSymbolizer.jsx"

export default class PolygonSymbolizer extends Component {
    state = {}
    render() {
        var { config, onChange } = this.props;
        return (
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
