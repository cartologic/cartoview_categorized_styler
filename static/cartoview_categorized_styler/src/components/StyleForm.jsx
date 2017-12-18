import { Component } from 'react';
import { Link } from 'react-router-dom'
import StylesManager from "../managers/StylesManager.jsx";
import WMSClient from "../gs-client/WMSClient.jsx";
import Rules from "./Rules.jsx";
import Classifier from "./Classifier/Classifier.jsx";
import BusyIndicator from './BusyIndicator.jsx';
import Symbolizer from './Symbolizer/Symbolizer.jsx';

class StyleForm extends Component {
  state = {}
  render(){
    var {styleObj} = this.state;
    if(styleObj == null){
      return <div className="loading"></div>;
    }
    const {match} = this.props;
    const style = styleObj.namedLayers[styleObj.name].userStyles[0];
    return <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <label>Title</label>
          <input value={style.title} onChange={(e) => {
              style.title = e.target.value
              this.setState({styleObj})
            }} className="form-control"/>
        </div>
        <div>
          <Classifier ref="classifier" config={styleObj.config} onChange={(config)=> this.updateConfig(config)}/>
        </div>
        <div className="form-group">
          <Link to={match.url + "/general-style"}
            className={"btn btn-primary pull-right" + (styleObj.config.method ? "" : " disabled")}>
            Next >>
          </Link>
        </div>
      </div>
    </div>
  }
  updateConfig(newConfig){
    var {styleObj} = this.state;
    StylesManager.updateStyleConfig(styleObj, newConfig);
    this.setState({styleObj})
  }
  componentDidMount(){
    const {styleName, layerName} = this.props.match.params;
    StylesManager.getStyle(layerName, styleName).then(styleObj => this.setState({styleObj}))
  }
}
export default StyleForm;
