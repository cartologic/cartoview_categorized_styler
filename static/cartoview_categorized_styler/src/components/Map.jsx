import React from 'react';
import ReactDOM from 'react-dom';
import WMSClient from "../gs-client/WMSClient.jsx";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    const {layerName, styleName} = props.config;
    this.layerSource = new ol.source.ImageWMS({
      url: URLS.wmsURL, 
      params: {
        LAYERS: layerName,
        STYLES: styleName,
        TILED: true,
      },
      serverType: 'geoserver'
    });
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({source: new ol.source.OSM()}),
        new ol.layer.Image({source: this.layerSource})
      ],
      view: new ol.View({center: [0, 0], zoom: 3})
    });
  }


  componentDidMount(){
    this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    WMSClient.getLayer(this.props.config.layerName).then(({bbox_x0, bbox_y0, bbox_x1, bbox_y1, srid}) => {
      const extent = [bbox_x0, bbox_y0, bbox_x1, bbox_y1].map(i=>parseFloat(i));
      this.map.getView().fit(ol.proj.transformExtent(extent, srid, "EPSG:3857"));
    })
  }


  refreshLayer() {
    var params = this.layerSource.getParams();
    params.t = new Date().getMilliseconds();
    this.layerSource.updateParams(params);
  }


  note(){
    return(
      <div className="panel panel-info" style={{margin: "15px auto auto auto"}}>
        <div className="panel-heading">Note:</div>
        <div className="panel-body">
          For more information about the created style layer descriptor 'SLD' you can view, edit and manage all layer related styles at the layer info page and manage styles
        </div>
      </div>
    )
  }


  render() {
    const {saved, config} = this.props;
    this.refreshLayer();
    const {layerName, styleName} = config;

    return(
      <div>

        <div ref="map" className='map-ct'>
          {
            !saved && <div className="map-mask">
              <div className="loading"></div>
            </div>
          }
        </div>

        <div className="flex-element preview-actions">
          <a className="btn btn-success" href={"/layers/" + layerName}>{"Layer Details"}</a>
          <a className="btn btn-info" href={"/gs/"+layerName+"/style/manage"}>{"Manage Styles"}</a>
        </div>

        {this.note()}

      </div>
    )
  }
}
