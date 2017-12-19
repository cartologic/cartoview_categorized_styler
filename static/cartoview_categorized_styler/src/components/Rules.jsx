import { ListGroup, ListGroupItem } from 'reactstrap';
import React, { Component } from 'react';

import LegendItem from "./Legend/LegendItem.jsx";

class Rule extends Component {
    state = { editing: false }
    
    getRuleTitle=()=>{
        const {rule}=this.props
        console.log(rule.title)
        let title= typeof(rule.title)==="undefined" || rule.title===null ? "No Value(null)": rule.title===""? "Empty" : rule.title
        return title
    }
    render() {
        const { rule, onClick } = this.props
        const { editing } = this.state
        return <ListGroupItem key={rule.id} tag="a"  action onClick={e => onClick(rule)}>
      {rule.symbolizers.map(s => <LegendItem symbolizer={s}/>)}
      {this.getRuleTitle()}
    </ListGroupItem>
    }
    onTitleChange( e ) {
        const { rule, onChange } = this.props;
        rule.title = e.target.value;
        onChange( rule );
    }
}
class Rules extends Component {
    componentDidMount() {}
    render() {
        const { rules, onSelectRule } = this.props;
        return <ListGroup>
      {
        rules.map((rule, index) =>
          <Rule rule={rule} onClick={(rule) => onSelectRule(index)} />)
      } </ListGroup>;
    }
}
export default Rules;
