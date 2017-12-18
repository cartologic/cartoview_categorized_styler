import { Component } from 'react';
import ColorWithOpacity from './ColorWithOpacity.jsx';
import LineSymbolizer from './LineSymbolizer.jsx';

class PolygonSymbolizer extends Component {
  render(){
    const {symbolizer} = this.props;
    return <div>
      <ColorWithOpacity symbolizer={symbolizer} property={"fill"}
        onChange={this.props.onChange} />
      <LineSymbolizer symbolizer={symbolizer} onChange={this.props.onChange} />
    </div>
  }
}
export default PolygonSymbolizer;
