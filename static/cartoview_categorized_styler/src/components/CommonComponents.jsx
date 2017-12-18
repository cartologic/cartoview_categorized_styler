import PropTypes from 'prop-types'
import React from 'react'
export const Loader = (props) => {
    return <div className="flex-element flex-center">
        <div className="loading"></div>
    </div>
}
Loader.propTypes = {

}
export const NextButton = (props) => {
    const { clickAction, disabled, message } = props
    return <button disabled={disabled} className={`btn btn-primary btn-sm pull-right next-button`} onClick={() => clickAction()}>
        {`${typeof (message) != "undefined" ? message : "Next"}`} <i className="fa fa-chevron-right" aria-hidden="true"></i>
    </button>
}
NextButton.propTypes = {
    clickAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    message: PropTypes.string
}
export const PreviousButton = (props) => {
    const { clickAction, disabled } = props
    return <button disabled={disabled} className={`btn btn-primary btn-sm pull-right next-button`} onClick={() => clickAction()}>
        <i className="fa fa-chevron-left" aria-hidden="true"></i> {"Back"}
    </button>
}
PreviousButton.propTypes = {
    clickAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
}