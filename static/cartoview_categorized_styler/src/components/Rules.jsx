import { Component } from 'react';
import LegendItem from "./Legend/LegendItem.jsx";
import { Button, ListGroup, ListGroupItem, Input } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

class Rule extends Component{
  state = {editing:false}
  render(){
    const {rule, onClick} = this.props;
    const {editing} = this.state;
    return <ListGroupItem key={rule.id} tag="a"  action onClick={e => onClick(rule)}>
      {rule.symbolizers.map(s => <LegendItem symbolizer={s}/>)}
      {rule.title}
    </ListGroupItem>
  }
  onTitleChange(e){
    const {rule, onChange} = this.props;
    rule.title = e.target.value;
    onChange(rule);
  }
}
class Rules extends Component {
  componentDidMount(){  }
  render(){
    const {rules, onSelectRule} = this.props;
    return <ListGroup>
      {
        rules.map((rule, index) =>
          <Rule rule={rule} onClick={(rule) => onSelectRule(index)} />)
      } </ListGroup>;
  }
}
export default Rules;
