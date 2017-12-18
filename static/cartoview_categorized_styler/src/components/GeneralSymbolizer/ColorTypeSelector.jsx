import { Component } from 'react';
import CartoColor from 'cartocolor';

import {SOLID, BY_VALUE} from "../../constants/constants.jsx";


export default class ColorTypeSelector extends Component {
  render(){
    const {type, onChange} = this.props;
    return (
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {`${type} `}   <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          {
            [SOLID, BY_VALUE].map(key => {return(
              <li className="" onClick={e => onChange(key)}>
                <a>{key}</a>
              </li>
            )})
          }
        </ul>
      </div>
    )
  }
}
