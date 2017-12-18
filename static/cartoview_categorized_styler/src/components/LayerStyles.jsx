import { NextButton, PreviousButton } from './CommonComponents'

import { Component } from 'react'
import WMSClient from "../gs-client/WMSClient.jsx"
import t from 'tcomb-form'

const Form = t.form.Form
const AlphaNumeric = t.refinement(t.String, (n) => {
  if (n.match(/^[0-9a-z]+$/)) {
    return true
  } else {
    return false
  }
})
AlphaNumeric.getValidationErrorMessage = (value) => {
  if (!value) {
    return 'Required'
  } else if (!value.match(/^[0-9a-z]+$/)) {
    return 'Only AlphaNumeric Allowed'
  }
}

const formSchema = t.struct({
  title: AlphaNumeric,
})
const options = {
  fields: {
    title: {
      label: "Style Name"
    },
  }
}
export default class LayerStyles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        title: this.props.styleTitle
          ? this.props.styleTitle
          : ""
      }
    }
  }

  // componentDidMount(){
  //   const {layerName} = this.props.config
  //   WMSClient.getLayerStyles(layerName).then((styles) => {
  //     this.setState({styles})
  //   })
  // }

  newStyle() {
    const value = this.form.getValue()
    if (value) {
      this.props.onComplete({ styleName: "new", title: this.state.value.title, error: false })
    }

  }
  onChange = (value) => {
    if (this.state.value.title !== value.title) {
      this.setState({ value: { title: value.title } })
    }
  }
  render() {
    // if(styles.length == 0){
    //   return <div className="loading"></div>
    // }

    const { config, onComplete } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-xs-5 col-md-4">
            <h4>{'Please Enter Style Name'}</h4>
          </div>
          <div className="col-xs-7 col-md-8">
            <NextButton clickAction={() => this.newStyle()} />
            <PreviousButton clickAction={() => this.props.onPrevious()} />
          </div>
        </div>

        <Form
          ref={(form) => this.form = form}
          value={this.state.value}
          type={formSchema}
          onChange={this.onChange}
          options={options} />

        {/*
        <p>
          {"or select style to override"}
        </p>
        <ListGroup>
          {
            styles.map((style) => (
              <ListGroupItem onClick={() => onComplete({styleName:style.name})} tag="a" href="#">
                {style.title || style.name}
              </ListGroupItem>)
            )
          }
        </ListGroup>
        */}
      </div>
    )
  }
}
