import {Component} from 'react';
import StyleWriter from './StyleWriter.jsx';
import ColorWithOpacity from '../components/Symbolizer/ColorWithOpacity.jsx';

export default class HeatmapConfigForm extends Component {
  renderHeader() {
    var {config, styleObj, onChange} = this.props;
    const onComplete = () => {
      this.props.onComplete(StyleWriter.write(config, styleObj));
    }
    return (
      <div className="row">
        <div className="col-xs-5 col-md-4">
          <h4>{'Heatmap Parameters '}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={() => onComplete()} disabled={!config.pixelsPerCell || !config.radius}>{"next >>"}</button>

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
    var {config, styleObj, onChange} = this.props;

    const onComplete = () => {
      this.props.onComplete(StyleWriter.write(config, styleObj));
    }

    return (
      <div>
        {this.renderHeader()}
        <div className="form-group">
          <label>{"Radius"}</label>
          <br></br>
          <input type="number" className="form-control" id="radius" value={config.radius} onChange={e => onChange({
            radius: parseInt(e.target.value)
          })}/>
        </div>
        <br></br>

        <div className="form-group">
          <label htmlFor={"pixelsPerCell"}>{"Pixels Per Cell"}</label>
          <input type="number" className="form-control" id="pixelsPerCell" value={config.pixelsPerCell} onChange={e => onChange({
            pixelsPerCell: parseInt(e.target.value)
          })}/>
        </div>
        <br></br>

        <ColorWithOpacity symbolizer={config} property={"start"} onChange={(config) => onChange(config)}/>
        <ColorWithOpacity symbolizer={config} property={"end"} onChange={(config) => onChange(config)}/>
      </div>
    )
  }
}
