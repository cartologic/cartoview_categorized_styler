import {Component} from 'react';
import {ListGroup, ListGroupItem} from 'reactstrap';

class GraduatedMethodSelector extends Component {
  state = {
    attrs: [],
    method: this.props.method || '',
    index: this.props.index || -1
  }

  renderHeader() {
    return (
      <div className="row">
        <div className="col-xs-5 col-md-4">
          <h4>{'Generate Thematic Styler'}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={this.state.index == -1
            ? "btn btn-primary btn-sm pull-right disabled"
            : "btn btn-primary btn-sm pull-right"} onClick={() => this.props.onComplete(this.state.method, this.state.index)}>{"next >>"}</button>

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
    const {onComplete} = this.props;
    const methods = [
      {
        label: 'Equal Interval',
        value: 'EQUAL_INTERVAL'
      }, {
        label: 'Quantile',
        value: 'QUANTILE'
      }, {
        label: 'Natural Breaks (Jenks)',
        value: 'NATURAL_BREAKS'
      }
    ];
    return <div>
      {this.renderHeader()}
      <ListGroup>
        {methods.map((m, i) => <ListGroupItem tag="a" href="#" onClick={() => this.setState({method: m.value, index: i})} style={this.state.index == i
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
          {m.label}
        </ListGroupItem>)}
      </ListGroup>
    </div>;
  }
}
export default GraduatedMethodSelector;
