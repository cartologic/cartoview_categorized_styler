import React, { Component } from 'react';
class NumOfClassesSelector extends Component {
    state = {
        attrs: [],
        numOfClasses: this.props.numOfClasses || undefined,
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
            : "btn btn-primary btn-sm pull-right"} onClick={() => this.props.onComplete(this.state.numOfClasses, this.state.index)}>{"next >>"}</button>

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
        const { onComplete } = this.props;
        const classes = [ 2, 3, 4, 5, 6, 7 ];
        return <div>
      {this.renderHeader()}
      <ul className={'list-group'}>
        {classes.map((c, i) => <li className={'list-group-item'} onClick={() => this.setState({numOfClasses: c, index: c})} style={this.state.index == c
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
          {c}
        </li>)
}
      </ul>
    </div>;
    }
}
export default NumOfClassesSelector;
