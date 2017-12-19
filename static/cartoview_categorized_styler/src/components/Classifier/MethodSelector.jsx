import React, { Component } from 'react';

class MethodSelector extends Component {
    render() {
        var { attr, method, onChange } = this.props;
        if (!attr) return null;
        var methods = [];
        if (['xsd:string'].indexOf(attr.attribute_type) != -1) {
            methods.push({
                label: "Unique Values",
                value: "UNIQUE_VALUES"
            })
        }
        else {
            methods = [{
                label: 'Equal Interval',
                value: 'EQUAL_INTERVAL'
            },
            {
                label: 'Quantile',
                value: 'QUANTILE'
            },
            {
                label: 'Natural Breaks (Jenks)',
                value: 'NATURAL_BREAKS'
            }]
        }

        if (method && !methods.find(m => m.value == method)) method = undefined;
        return <div className="form-group" >
            <label>Classification Method</label>
            <select className="form-control" onChange={(e) => onChange(e.target.value)} value={method}>
                {!method && <option>Select Method</option>}
                {
                    methods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)
                }
            </select>
        </div>
    }
}

export default MethodSelector;
