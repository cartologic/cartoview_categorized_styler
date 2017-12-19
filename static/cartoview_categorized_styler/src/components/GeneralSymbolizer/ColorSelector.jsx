import { BY_VALUE, DEFAULT_COLOR, DEFAULT_PALETTE, SOLID } from "../../constants/constants.jsx"
import React, { Component } from 'react'

import Alpha from './Alpha.jsx'
import ColorTypeSelector from "./ColorTypeSelector.jsx"
import ColorWithOpacity from "../Symbolizer/ColorWithOpacity.jsx"
import PaletteSelector from "./PaletteSelector.jsx"

export default class ColorSelector extends Component {
    render() {
        const { config, property, onChange } = this.props

        const type = config[property]
        const alpha = parseFloat(config[property + "Opacity"] || 1) * 100
        const onAlphaChange = (alpha) => {
            const newConfig = {}
            newConfig[property + "Opacity"] = alpha / 100
            onChange(newConfig)
        }


        const onTypeChange = (type) => {
            const newConfig = {}
            if (type == BY_VALUE) {
                newConfig[property + "Color"] = DEFAULT_PALETTE
            }
            else {
                newConfig[property + "Color"] = DEFAULT_COLOR
            }
            newConfig[property] = type
            onChange(newConfig)
        }


        return (
            <div className="row">
                <div className="col-xs-12 col-md-2">
                    <ColorTypeSelector type={type} onChange={(type) => onTypeChange(type)} />
                </div>
                {
                    type == SOLID && <div className="col-xs-5 col-md-3" style={{ marginTop: "2px" }} >
                        <ColorWithOpacity symbolizer={config} property={property} noLabel={true}
                            onChange={(symbolizer) => onChange(symbolizer)} />
                    </div>
                }
                {
                    type == BY_VALUE && <div className="col-xs-3 col-md-3" style={{ marginTop: "2px" }} >
                        <PaletteSelector symbolizer={config} property={property}
                            onChange={(symbolizer) => onChange(symbolizer)} />
                    </div>
                }
                {
                    type == BY_VALUE && <div className="col-xs-11 col-xs-offset-1 col-md-3" style={{ marginTop: "2px" }} >
                        <div className="rc-color-picker-panel-wrap-alpha" style={{ top: "100%" }}>
                            <Alpha rootPrefixCls="rc-color-picker-panel"
                                alpha={alpha}
                                hsv={{ h: 0, s: 0, v: 33 }}
                                onChange={(alpha) => onAlphaChange(alpha)} />
                        </div>
                    </div>
                }
            </div>
        )

    }


}
