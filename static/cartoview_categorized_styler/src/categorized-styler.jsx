import "../css/styler.css"

import {
    BY_VALUE,
    DEFAULTS,
    DEFAULT_COLOR,
    DEFAULT_NUM_OF_CLASSES,
    DEFAULT_PALETTE,
    DefaultModalStyle,
    MAX_SIZE,
    SOLID,
    UNIQUE_VALUES
} from './constants/constants.jsx'
import React, { Component } from 'react'

import AttributeSelector from './components/AttributeSelector.jsx'
import CustomStyle from './components/CustomStyle.jsx'
import GeneralSymbolizer from './components/GeneralSymbolizer.jsx'
import LayerStyles from './components/LayerStyles.jsx'
import LayersList from './components/LayersList.jsx'
import Map from './components/Map.jsx'
import Modal from 'react-modal'
import Navigator from './components/Navigator.jsx'
import ReactDOM from 'react-dom'
import StylesManager from "./managers/StylesManager.jsx"
import WMSClient from './gs-client/WMSClient.jsx'
import WPSClient from './gs-client/WPSClient.jsx'

class Styler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            config: Object.assign({}, DEFAULTS),
            step: 0,
            currentLayer: null,
            saved: false,
            error: false,
            modalIsOpen: false
        }
    }

    aboutHeader() {
        return (
            <h3>Categorized Thematic Styler</h3>
        )
    }

    aboutBody() {
        return (
            <div>
                <p>
                    {"Create a layer color range categorized value style layer descriptor(SLD), SLD addresses the need for users and software to be able to control the visual portrayal of the geospatial data."}
                </p>
                <p>{"This app will give you the ability to define categorized styling rules."}</p>

                <div className="row">
                    <div className='col-xs-12 col-md-10 col-md-offset-1'>
                        <img className='img-responsive' src={`/static/${APP_NAME}/images/worldwide categorized thematic map.jpg`} alt="" />
                    </div>
                </div>
                <p>
                    {"The above image demonstrates a typical example for a categorized thematic map, To start creating your own styles click (Next)"}
                </p>
            </div>
        )
    }

    helpModal() {
        return (
            <Modal className="modal-dialog" isOpen={this.state.modalIsOpen} style={DefaultModalStyle} onRequestClose={() => {
                this.setState({ modalIsOpen: false })
            }}>
                <div className="">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-xs-6 col-md-6">
                                    {this.aboutHeader()}
                                </div>
                                <div className="col-xs-1 col-md-1 col-md-offset-5 col-xs-offset-5">
                                    <div className="pull-right">
                                        <a className="btn btn btn-primary" onClick={(e) => {
                                            e.preventDefault()
                                            this.setState({ modalIsOpen: false })
                                        }}><i className="fa fa-times" aria-hidden="true"></i>                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-12">
                                    {this.aboutBody()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    navBar() {
        return (
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-6 col-md-6">
                            <h4 style={{
                                color: "dimgray"
                            }}>Categorized Styler</h4>
                        </div>
                        <div className="col-xs-1 col-md-1 col-md-offset-5 col-xs-offset-4">
                            <button type="button" style={{
                                marginTop: "8%"
                            }} className="btn btn-primary" onClick={() => {
                                this.setState({ modalIsOpen: true })
                            }}>
                                ?
              </button>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
    render() {
        var { config, styleObj, step, saved } = this.state
        const steps = [
            {
                label: "Select Layer",
                component: LayersList,
                props: {
                    onComplete: (layer) => {
                        this.setState({ currentLayer: layer })
                        this.updateConfig({ layerName: layer.typename })
                    },
                    layerType: "",
                    currentLayer: this.state.currentLayer
                }
            }, {
                label: "Set new style name",
                component: LayerStyles,
                props: {
                    onComplete: (newConfig) => {
                        this.updateConfig(newConfig)
                        const { config } = this.state
                        const { layerName, styleName } = config
                        StylesManager.getStyle(layerName, styleName, newConfig.title).then(styleObj => {
                            config.styleName = styleObj.name
                            this.setState({ styleObj, config })
                        })
                    },

                    onPrevious: () => this.setState({
                        step: this.state.step -= 1
                    }),
                    styleTitle: this.state.config
                        ? this.state.config.title
                        : undefined
                }
            }, {
                label: "Select Attribute",
                component: AttributeSelector,
                props: {
                    onComplete: (attribute, index) => {
                        this.updateConfig({ attribute, selectedAttrIndex: index })
                        const { layerName } = this.state.config
                        WPSClient.gsUnique(layerName, attribute).then(res => {
                            WMSClient.getLayerType(layerName).then(layerType => this.updateConfig({
                                attribute,
                                layerType,
                                numOfClasses: Math.min(res.features.length, 11)
                            }, true))
                        })
                    },
                    // all attributes which is not geometry
                    filter: a => a.attribute_type.indexOf("gml:") == -1,
                    tip: "String attributes only are only available for this step",
                    onPrevious: () => {
                        this.setState({
                            step: this.state.step -= 1
                        })
                    },
                    attribute: this.state.config.attribute,
                    index: this.state.config.selectedAttrIndex
                }
            }, {
                label: "Generate Thematic Style",
                component: GeneralSymbolizer,
                props: {
                    type: UNIQUE_VALUES,
                    onComplete: () => {
                        StylesManager.createUniqueRules(styleObj, config).then((styleObj) => {
                            step++
                            this.setState({ styleObj, step })
                        })
                    },
                    onChange: (newConfig) => this.updateConfig(newConfig, true),
                    onPrevious: () => {
                        this.setState({
                            step: this.state.step -= 1
                        })
                    }
                }
            }, {
                label: "Customize Style",
                component: CustomStyle,
                props: {
                    onChange: (styleObj) => this.setState({ styleObj }),
                    onComplete: () => {
                        this.updateConfig({})
                        StylesManager.saveStyle(styleObj, config).then((response) => {
                            if (response.status >= 400) {
                                this.setState({ error: true })
                            } else {
                                this.setState({ saved: true })
                            }

                        }).catch(() => {
                            this.setState({ error: true })
                        })
                    },
                    onPrevious: () => {
                        this.setState({
                            step: this.state.step -= 1
                        })
                    }
                }
            }, {
                label: "Preview",
                component: Map,
                props: {
                    saved
                }
            }
        ]

        return (
            <div className="col-md-12">
                {this.helpModal()}
                <div className="row">{this.navBar()}</div>
                {!this.state.error && <div className="row">
                    <Navigator steps={steps} step={step} onStepSelected={(step) => this.goToStep(step)} />
                    <div className="col-md-9">
                        {steps.map((s, index) => index == step && <s.component {...s.props} config={config} styleObj={styleObj} />)}
                    </div>
                </div>}
                {this.state.error && <div className="row text-center">
                    <h1>{"Error Saving Style"}</h1>
                </div>}
            </div>
        )
    }

    updateConfig(newConfig, sameStep) {
        var { config, step } = this.state
        Object.assign(config, newConfig)
        if (!sameStep)
            step++
        const saved = false
        this.setState({ config, step, saved })
    }
    goToStep(step) {
        this.setState({ step })
    }
}

global.Styler = Styler
global.React = React
global.ReactDOM = ReactDOM
export default Styler
