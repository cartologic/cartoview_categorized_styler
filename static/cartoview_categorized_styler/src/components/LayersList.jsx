import 'react-toggle-switch/dist/css/switch.min.css'

import { Loader, NextButton } from './CommonComponents'

import { Component } from 'react';
import Search from "./Search.jsx";
import Switch from 'react-toggle-switch'
import WMSClient from "../gs-client/WMSClient.jsx"
import classNames from 'classnames'

// box-shadow: 0px 0px 10px 5px steelblue;
export default class LayersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
            currentPage: 1,
            limit_offset: 5,
            totalCount: 0,
            showPagination: true,
            myLayers: true,
            selectedLayer: this.props.currentLayer,
            loading: true
        }
    }

    loadLayers(username) {
        this.setState({
            loading: true
        }, () => {
            let url = `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}&limit=${this.state.limit_offset}`
            if (username)
                url = `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}&limit=${this.state.limit_offset}&owner=${username}`

            fetch(url, { credentials: 'include' }).then((res) => res.json()).then((layers) => {
                this.setState({
                    layers: layers.objects,
                    next: layers.meta.next,
                    prev: layers.meta.previous,
                    totalCount: layers.meta.total_count,
                    loading: false
                })
            })
        })
    }

    searchLayers(layerTypeName) {
        if (layerTypeName) {
            let url = `/apps/${APP_NAME}/api/layers/?typename=${layerTypeName}&type=${this.props.layerType}&${this.state.limit_offset}`
            if (this.state.myLayers)
                url = `/apps/${APP_NAME}/api/layers/?typename=${layerTypeName}&type=${this.props.layerType}&${this.state.limit_offset}&owner=${username}`
            fetch(url, { credentials: 'include' }).then((res) => res.json()).then((layers) => {
                this.setState({ layers: layers.objects, showPagination: false })
            })
        } else {
            // clear button
            this.setState({
                showPagination: true,
            }, () => {
                if (this.state.myLayers) {
                    this.loadLayers(username)
                } else {
                    this.loadLayers()
                }
            })
        }
    }

    onPaginationClick(e, step) {
        e.preventDefault()
        switch (step) {
            case "prev":
                if (this.state.prev)
                    this.setState({
                        currentPage: this.state.currentPage -= 1,
                        limit_offset: this.state.prev
                    }, () => {
                        this.loadLayers();
                    })
                break;
            case "next":
                if (this.state.next)
                    this.setState({
                        currentPage: this.state.currentPage += 1,
                        limit_offset: this.state.next
                    }, () => {
                        this.loadLayers();
                    })
                break;
        }
    }

    componentWillMount() {
        this.loadLayers(username);
    }

    handleSwitch() {
        this.setState({
            myLayers: !this.state.myLayers
        }, () => {
            this.state.myLayers
                ? this.loadLayers(username)
                : this.loadLayers()
        })
    }

    renderPagination() {
        return (
            <ul className="pagination">
                <li>
                    <a onClick={(e) => this.onPaginationClick(e, "prev")} style={{
                        cursor: "default"
                    }}>{"<"}</a>
                </li>
                <li>
                    <a onMouseDown={(e) => e.preventDefault()} style={{
                        cursor: "default"
                    }}>{this.state.currentPage}</a>
                </li>
                <li>
                    <a onClick={(e) => this.onPaginationClick(e, "next")} style={{
                        cursor: "default"
                    }}>{">"}</a>
                </li>
            </ul>
        )
    }

    renderHeader() {
        return (
            <div className="row">
                <div className="col-xs-5 col-md-4">
                    <h4>{'Select Layer'}</h4>
                </div>
                <div className="col-xs-7 col-md-8">
                    {this.state.selectedLayer
                        ? <NextButton clickAction={() => this.props.onComplete(this.state.selectedLayer)} />
                        : <NextButton clickAction={() => this.props.onComplete()} disabled={true} />}
                </div>
            </div>
        )
    }

    renderSwitchSearch() {
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 flex-element">
                    <span className="switcher-label">{'Shared Layers'}</span>
                    <Switch on={this.state.myLayers} onClick={() => this.handleSwitch()} />
                    <span className="switcher-label">{'My Layers'}</span>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8">
                    <Search layerType={this.props.layerType} myLayers={this.state.myLayers} searchLayers={(layerName) => {
                        this.searchLayers(layerName)
                    }} />
                </div>
            </div>
        )
    }

    renderLayers() {
        const { layers, selectedLayer } = this.state;
        const { onComplete } = this.props;
        return (
            <ul className="list-group">
                {layers.map((layer, i) => {
                    return (
                        <div>
                            <li className={classNames("list-group-item card", { "selected-card": selectedLayer && selectedLayer.typename === layer.typename })} onClick={() => { this.setState({ selectedLayer: layer }) }} >
                                <div className="row">
                                    <div className="col-xs-12 col-md-3 img-container">
                                        <img className="img-responsive card-img" src={layer.thumbnail_url} />
                                    </div>

                                    <div className="col-xs-12 col-md-9">
                                        <div className="content">
                                            <h4 className="list-group-item-heading" style={{
                                                marginTop: "1%"
                                            }}>{layer.title}</h4>
                                            <hr />
                                            <p className="mb-1">{`${layer.abstract.substring(0, 140)} ...`}</p>
                                            <p>{`Owner: ${layer.owner.username}`}</p>

                                            <a type="button" href={`/layers/${layer.typename}`} target="_blank" className="btn btn-primary pull-right card-details-button" >
                                                {"Layer Details"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <br></br>
                        </div>
                    )
                })}
            </ul>
        )
    }

    renderTip1() {
        return (
            <div className="panel panel-danger" style={{
                margin: "15px auto 15px auto"
            }}>
                <div className="panel-heading">No Layers</div>
                <div className="panel-body">
                    <p>You have not created any layers! Please create or upload layers</p>
                    <a className='btn btn-primary pull-right' target="_blank" href='/layers/upload'>Upload a layer</a>

                </div>
            </div>
        )
    }
    renderTip2() {
        return (
            <div className="panel panel-danger" style={{
                margin: "15px auto 15px auto"
            }}>
                <div className="panel-heading">No Layers</div>
                <div className="panel-body">
                    <p>You don't have layers shared with you! Please create or upload layers</p>
                    <a className='btn btn-primary pull-right' target="_blank" href='/layers/upload'>Upload a layer</a>

                </div>
            </div>
        )
    }

    render() {
        const { layers } = this.state;
        const { onComplete } = this.props;
        return (
            <div>
                {this.renderHeader()}
                <br />
                {this.renderSwitchSearch()}
                <br />
                {this.state.loading == true
                    ? <Loader />
                    : this.state.layers.length != 0
                        ? this.renderLayers()
                        : this.state.myLayers
                            ? this.renderTip1()
                            : this.renderTip2()}

                <div className="row">
                    <div className="col-xs-6 col-xs-offset-4 col-md-2 col-md-offset-5">
                        {this.state.showPagination && this.renderPagination()}
                    </div>
                </div>
            </div>
        )
    }
}
