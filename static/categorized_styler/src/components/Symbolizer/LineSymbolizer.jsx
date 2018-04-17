
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import ColorWithOpacity from './ColorWithOpacity.jsx';

class LineSymbolizer extends Component {
  constructor(props){
    super(props)
  }
  render(){
    const {symbolizer} = this.props;
    const onChange = (e) => {
      if(e.target.value){
        symbolizer.strokeWidth = parseFloat(e.target.value);
        this.props.onChange(symbolizer);
      }
    }
    return <div>
      <ColorWithOpacity symbolizer={symbolizer} property={"stroke"}
        onChange={(symbolizer) => this.props.onChange(symbolizer)} />
      <FormGroup>
        <Label>Stroke Width</Label>
        <Input type="number" value={symbolizer.strokeWidth}
          step={1} min={0} max={10}
          onChange={(e) => onChange(e)}/>
      </FormGroup>
    </div>
  }
}
export default LineSymbolizer;
