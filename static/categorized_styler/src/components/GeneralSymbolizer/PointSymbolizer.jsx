import React, { Component } from 'react';

import PolygonSymbolizer from "./PolygonSymbolizer.jsx";

export default class PointSymbolizer extends Component {
    render() {
        var { config, onChange } = this.props;
        return (
            <div>
                <div className="form-group">
                    <label>Symbol</label>
                    <select className="form-control" type="select" value={config.graphicName} onChange={e => onChange({ graphicName: e.target.value })}>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="star">Star</option>
                        <option value="x">X</option>
                        <option value="cross">Cross</option>
                        <option value="triangle">Triangle</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Point Radius</label>
                    <input className="form-control" type="number" value={config.pointRadius}
                        step={1} min={0} max={50} style={{ width: "80px" }}
                        onChange={(e) => onChange({ pointRadius: parseFloat(e.target.value) })} />
                </div>
                <PolygonSymbolizer {...this.props} />
            </div>
        )
    }
}
