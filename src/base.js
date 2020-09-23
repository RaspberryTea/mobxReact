import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import DevTools from 'mobx-react-devtools';
import { configure, observable, action } from 'mobx'
import { observer } from 'mobx-react'

configure({ enforceActions: 'observed' });

const nickName = observable({

    firstName: 'Gus',
    age: '12',

    get nickName() {
    console.log('Generate nickname!');
    return `${this.firstName}${this.age}`;
  },

  increment() {this.age++},

  decrement() {this.age--},

}, {
  increment: action('Plus one'),
  decrement: action('Minus one'),
}
);

const todos = observable([
  {text : 'Buy money'},
  {text : 'Buy happiness'},
])

@observer class Counter extends Component {

  handleIncrement = () => { this.props.store.increment() }
  handleDecrement = () => { this.props.store.decrement() }

  render() {
    return (
      <div className="App">
        <DevTools />
        <h1>{this.props.store.nickName}</h1>
        <h1>{this.props.store.age}</h1>
        <button onClick={this.handleIncrement}>+1</button>
        <button onClick={this.handleDecrement}>-1</button>

        {/*<ul>
        {todos.map(({ text }) => <li key = {text}>{text}</li>)}
        </ul>*/}

      </div>
    );
  }
}

ReactDOM.render(<Counter store ={nickName} />, document.getElementById('root'));

todos.push({text: 'By myself'}) {/* показывает, что туду действительно в обсервабле */}

serviceWorker.unregister();
