import React, { Component } from 'react'

import colors from "../../constants/colors.jsx"

class UniqueValuesRules extends Component {
    render() {
        var { classes, method } = this.props;
        if (!method || method != 'UNIQUE_VALUES' || !classes || classes.length == 0) return null;


        return <table className="unique-values table table-striped table-bordered table-sm">
            <thead>
                <tr className="thead-default">
                    <th style={{ width: '60px' }}>Color</th>
                    <th>Class Value</th>
                    <th>Class Label</th>
                </tr>
            </thead>
            <tbody>
                {classes.map((c, index) => {
                    var changeColor = (e) => {
                        c.color = e.target.value;
                        this.props.onChange(classes)
                    }
                    var changeLabel = (e) => {
                        c.label = e.target.value;
                        this.props.onChange(classes)
                    }
                    return <tr key={c.value}>
                        <td>
                            <input type="color" onChange={changeColor} value={c.color} />
                        </td>
                        <td>{c.value}</td>
                        <td>
                            <input className="form-control" onChange={changeLabel} value={c.label} />
                        </td>
                    </tr>
                })
                }
            </tbody>
        </table>;
    }
}

export default UniqueValuesRules;
