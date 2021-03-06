import { Loader, NextButton, PreviousButton } from './CommonComponents'
import React, { Component } from 'react'

import WMSClient from "../gs-client/WMSClient.jsx"
import classNames from 'classnames'

export default class AttributeSelector extends Component {
    state = {
        attrs: [],
        selectedIndex: this.props.index ? this.props.index : -1,
        selectedAttribute: this.props.attribute ? this.props.attribute : ''
    }
    getLayerAttributes(layerName){
        WMSClient.getLayerAttributes( layerName ).then( ( attrs ) => {
            if (attrs && attrs.length > 0)
                this.setState( {loading: false , attrs } )
            else
                this.setState({loading: false, noAttributes: true})
        } )
    }
    componentDidMount() {
        const { layerName } = this.props.config;
        this.setState({
            loading: true
        }, ()=>{
            this.getLayerAttributes(layerName)
        })
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
        this.props.onComplete( this.state.selectedAttribute, this.state.selectedIndex )
    }
    renderNoAttributesErrorMessage(){
        return(
            <div className="panel panel-danger">
                <div className="panel-heading">Error:</div>
                <div className="panel-body">
                    The selected layer has no attributes !
                </div>
            </div>
        )
    }
    render() {
        const { attrs } = this.state;
        const { onComplete, filter } = this.props;
        const isGeom = ( a ) => {
            return a.attribute_type.toLowerCase().indexOf( "gml:" ) ==
                0;
        }
        if (this.state.loading) return <Loader />
        if (this.state.noAttributes) return this.renderNoAttributesErrorMessage()

        return (
            <div>
        <div className="row">
          <div className="col-xs-5 col-md-4">
            <h4>{'Select Attribute'}</h4>
          </div>
          <div className="col-xs-7 col-md-8">
            <NextButton disabled={this.state.selectedAttribute ? false : true} clickAction={() => this.onComplete()} />
            <PreviousButton clickAction={() => this.props.onPrevious()} />
          </div>
        </div>

        <ul className="list-group">
          {attrs.map((a, i) => isGeom(a) || !filter(a)
            ? null
            : <li className={classNames("list-group-item li-attribute", { "li-attribute-selected": this.state.selectedIndex == i })} onClick={() => {
              this.setState({ selectedAttribute: a.attribute, selectedIndex: i })
            }}>
              {a.attribute_label || a.attribute}
              ({a.attribute_type})
            </li>)}
        </ul>
      </div>
        )
    }
}
