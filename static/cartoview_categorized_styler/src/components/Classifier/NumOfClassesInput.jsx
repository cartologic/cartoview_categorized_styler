import { Component } from 'react';


class NumOfClassesInput extends Component {
  render(){
    var {attr, method, numOfClasses, onChange} = this.props;
    if(!method || method == 'UNIQUE_VALUES') return null;
    // numOfClasses = numOfClasses || 5;

    return  <div className="form-group" >
        <label>Number Of Classes</label>
        <input onChange={(e) => onChange(e.target.value)} value={numOfClasses}
          type="number" min={1} step={1} className="form-control"/>
      </div>;
  }
}

export default NumOfClassesInput;
