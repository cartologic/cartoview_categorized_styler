import { Component } from 'react';
import AttributeSelector from './AttributeSelector.jsx';
import MethodSelector from './MethodSelector.jsx';
import NumOfClassesInput from './NumOfClassesInput.jsx';
import WPSClient from '../../gs-client/WPSClient.jsx'

class Classifier extends Component {
  state = {}
  render(){
    const {attr, busy} = this.state;
    const {config, onChange} = this.props;
    const onAttributeChange = (newAttr) => {
      const newConfig = {attribute: newAttr.attribute};
      if(attr && attr.attribute_type != newAttr.attribute_type){
        newConfig.method = undefined;
      }
      this.setState({attr:newAttr})
      onChange(newConfig)
    }
    return <div>
        <AttributeSelector {...config} attr={attr} onChange={onAttributeChange} />
        <MethodSelector {...config} attr={attr} onChange={(method) => onChange({method})}/>
        <NumOfClassesInput {...config} attr={attr} onChange={(numOfClasses) => onChange({numOfClasses})}/>
    </div>;
  }
}
export default Classifier;
