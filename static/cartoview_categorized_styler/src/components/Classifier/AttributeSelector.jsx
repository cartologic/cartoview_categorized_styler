import React, { Component } from 'react'

import WMSClient from "../../gs-client/WMSClient.jsx"

export default class AttributeSelector extends Component {
    state = {
        attrs: []
    }
    componentDidMount() {
        const { layerName, attribute } = this.props
        WMSClient.getLayerAttributes(layerName).then((attrs) => {
            if (attribute) {
                const attr = attrs.find(a => a.attribute == attribute);
                this.props.onChange(attr)
            }
            this.setState({ attrs })
        });
    }
    render() {
        const { attrs } = this.state;
        const { attr } = this.props;
        const value = attr ? attr.attribute : undefined
        const isGeom = (a) => {
            return a.attribute_type.toLowerCase().indexOf("gml:") == 0
        }
        const onChange = (e) => {
            this.props.onChange(attrs.find(a => a.attribute == e.target.value))
        }
        return <div className="form-group" >
            <label>Attribute</label>
            <select className="form-control" onChange={onChange} value={value}>
                {!value && <option>Select Attribute</option>}
                {
                    attrs.map(a => isGeom(a) ? null : <option value={a.attribute}>{a.attribute_label || a.attribute} ({a.attribute_type})</option>)
                }
            </select>
        </div>;
    }
}
