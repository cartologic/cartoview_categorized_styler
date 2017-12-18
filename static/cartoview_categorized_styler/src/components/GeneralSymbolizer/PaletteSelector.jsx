import { Component } from 'react';
import CartoColor from 'cartocolor';


const preview = (colors) => colors.map(c => <span className="palette-item" style={{backgroundColor:c}}></span>);


export default class PaletteSelector extends Component {
  render(){
    const {symbolizer, property} = this.props;
    var count = symbolizer.numOfClasses.toString();
    const palette = symbolizer[property + "Color"]

    const onChange = (palette) => {
      symbolizer[property + "Color"] = palette
      this.props.onChange(symbolizer);
    }

    return(
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {
            palette && CartoColor[palette] && CartoColor[palette][count]
            && preview(CartoColor[palette][count])
          } <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1" style={{textAlign:"center"}}>
          {
            Object.keys(CartoColor).map((key) => {
              if(CartoColor[key][count])
                return <li onClick={e => onChange(key)} style={{marginLeft:"2px", marginRight: "2px"}}>
                  { key == palette && <span className="palette-item fa fa-caret-right"></span>}
                  { preview(CartoColor[key][count])}
                </li>
              return null;
            })
          }
        </ul>
      </div>
    )
  }
}
