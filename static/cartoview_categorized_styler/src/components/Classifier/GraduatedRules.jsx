import { Component } from 'react';
import colors from "../../constants/colors.jsx";

class GraduatedRules extends Component {
  render(){
    var {classes, method} = this.props;
    const SUPPORTED_METHODS = ["EQUAL_INTERVAL", "QUANTILE", "NATURAL_BREAKS"];
    if(SUPPORTED_METHODS.indexOf(method) == -1 || !classes || classes.length == 0) return null;


    return  <table className="unique-values table table-striped table-bordered table-sm">
      <thead>
        <tr className="thead-default">
          <th style={{width:'60px'}}>Color</th>
          <th>From Value</th>
          <th>To Value</th>
          <th>Class Label</th>
        </tr>
      </thead>
      <tbody>
        { classes.map((c, index) => {
            var changeColor = (e) => {
              c.color = e.target.value;
              this.props.onChange(classes)
            }
            var changeLabel = (e) => {
              c.label = e.target.value;
              this.props.onChange(classes)
            }
            return <tr key={c.min + ""}>
              <td>
                <input type="color"  onChange={changeColor} value={c.color} />
              </td>
              <td>{c.min}</td>
              <td>{c.max}</td>
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

export default GraduatedRules;
