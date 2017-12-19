import { Loader, NextButton, PreviousButton } from './CommonComponents'
import React, { Component } from 'react';

import LineSymbolizer from "./GeneralSymbolizer/LineSymbolizer.jsx"
import PointSymbolizer from "./GeneralSymbolizer/PointSymbolizer.jsx"
import PolygonSymbolizer from "./GeneralSymbolizer/PolygonSymbolizer.jsx"

export default class GeneralSymbolizer extends Component {
    state = {}
    renderHeader() {
        return (
            <div className="row">
        <div className="col-xs-5 col-md-4">
          <h4>{'Generate Thematic Styler'}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <NextButton clickAction={() => this.props.onComplete()} />
          <PreviousButton clickAction={() => this.props.onPrevious()} />
        </div>
      </div>
        )
    }
    render() {
        const { config, styleObj, type, onComplete, onChange } = this.props;
        const { numOfClasses, layerType } = config;
        if ( !numOfClasses ) {
            return <Loader />
        }
        var Symbolizer = layerType == "Point" ? PointSymbolizer :
            layerType == "Polygon" ? PolygonSymbolizer : LineSymbolizer;
        return (
            <div>
        {this.renderHeader()}
        <br></br>
        <Symbolizer config={config} onChange={newConfig => onChange(newConfig)} />
      </div>
        )
    }
}
