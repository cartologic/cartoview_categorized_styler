import React, {Component} from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";

export class AttributeSelector extends Component {
  state = {
    attrs: [],
    selectedIndex: this.props.index
      ? this.props.index
      : -1,
    selectedAttribute: this.props.attribute
      ? this.props.attribute
      : ''
  }

  componentDidMount() {
    const {layerName} = this.props.config;
    WMSClient.getLayerAttributes(layerName).then((attrs) => {
      this.setState({attrs});
    });
  }

  tip() {
    return (
      <div className="panel panel-info" style={{
        margin: "15px auto 15px auto"
      }}>
        <div className="panel-heading">Tip:</div>
        <div className="panel-body">
          {this.props.tip}
        </div>
      </div>
    )
  }

  onComplete() {
    this.props.onComplete(this.state.selectedAttribute, this.state.selectedIndex)
  }

  render() {
    const {attrs} = this.state;
    if (attrs.length == 0) {
      return <div className="loading"></div>
    }
    const {onComplete, filter} = this.props;
    const isGeom = (a) => {
      return a.attribute_type.toLowerCase().indexOf("gml:") == 0;
    }

    return (
      <div>
        <ul className="list-group">
          {attrs.map((a, i) => isGeom(a) || !filter(a)
            ? null
            : <li className="list-group-item" onClick={() => {
              this.setState({
                selectedAttribute: a.attribute,
                selectedIndex: i
              }, () => {
                this.props.selectedIndex(i)
              })
            }} style={this.state.selectedIndex == i
              ? {
                boxShadow: "0px 0px 10px 5px steelblue",
                marginTop: "8px",
                marginBottom: "8px",
                cursor: 'pointer'
              }
              : {
                marginTop: "8px",
                marginBottom: "8px",
                cursor: 'pointer'
              }}>
              {a.attribute_label || a.attribute}
              ({a.attribute_type})
            </li>)}
        </ul>

        {this.tip()}
      </div>
    )
  }
}

class WeightSelector extends Component {
  state = {
    showAttributes: false,
    selectedIndex: -1
  }

  componentDidMount() {}

  renderHeader() {
    return (
      <div className="row">
        <div className="col-xs-5 col-md-4">
          <h4>{'Select Weight'}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={this.state.selectedIndex == -1
            ? "btn btn-primary btn-sm pull-right disabled"
            : "btn btn-primary btn-sm pull-right"} onClick={() => this.props.onComplete()}>{"next >>"}</button>

          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={() => {
            this.props.onPrevious()
          }}>{"<< Previous"}</button>
        </div>
      </div>
    )
  }

  render() {

    const {config, onComplete} = this.props;
    const attrFilter = (a) => ["xsd:int", "xsd:double", "xsd:long"].indexOf(a.attribute_type.toLowerCase()) != -1
    return (
      <div>
        {this.renderHeader()}
        <br></br>

        <div className="panel panel-default">
          <div className="panel-body">
            <p>
              {"Option 1: Set weight by distance"}
              <button className="btn btn-primary" onMouseDown={() => onComplete(null)} style={{
                float: "right"
              }}>
                {"Weight by distance"}
              </button>
            </p>
          </div>
        </div>
        <br></br>

        <div className="panel panel-default">
          <div className="panel-body">
            <p>
              {"Option 2: Set Based on Attribute"}
              <button className="btn btn-primary" onMouseDown={() => this.setState({showAttributes: true})} style={{
                float: "right"
              }}>
                Select Attribute
              </button>
            </p>
          </div>
        </div>
        {this.state.showAttributes && <AttributeSelector selectedIndex={(index) => this.setState({selectedIndex: index})} {...this.props} filter={attrFilter}/>}
      </div>
    )
  }
}
export default WeightSelector;
