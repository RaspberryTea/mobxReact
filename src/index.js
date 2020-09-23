import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { configure, observable, action, computed, decorate } from 'mobx'
import { observer } from 'mobx-react'

configure({ enforceActions: 'observed' });

class Store {
  devsList = [
    { name: "Ivan", points: 120},
    { name: "Vasiliy", points: 100},
    { name: "Nikolai", points: 99},
  ];

  filter: '';

  get totalSum(){
    return this.devsList.reduce((sum, { points }) => sum += points, 0);
  };

  get topPerformer(){
    const maxPoints = Math.max(...this.devsList.map(({ points }) => points));
    return this.devsList.find(({ points, name }) => {
      if (maxPoints === points) {
        return name;
      }
    })
  };

  get filteredDevelopers() {
    const matchesFilter = new RegExp(this.filter, "i");
    return this.devsList.filter(({ name }) => !this.filter || matchesFilter.test(name));
  }

  clearList() {
    this.devsList = [];
  };

  addDeveloper(dev) {
    this.devsList.push(dev);
  };

  removeLastDeveloper() {
    this.devsList.pop()
  }

  updateFilter(value)  {
    this.filter = value; 
  }
};

decorate(Store, {
  devsList: observable,
  filter: observable,
  totalSum: computed,
  topPerformer: computed,
  filteredDevelopers: computed,
  clearList: action,
  addDeveloper: action,
  removeLastDeveloper: action,
  updateFilter: action,
})

const appStore = new Store();

const Row = ({ data: { name, points } }) => {
  return (
    <tr>
      <td> {name} </td>
      <td> {points} </td>
    </tr>
  );
};

@observer class Table extends Component {
  render() {
    const { store } = this.props;

    return (
      <table>
        <thead>
          <tr>
            <td>Name:</td>
            <td>Points:</td>
          </tr>
        </thead>
        <tbody>
          {store.filteredDevelopers.map((dev, i) => <Row key={i} data={dev} />)}
        </tbody>
        <tfoot>
          <tr>
            <td>Team Points:</td>
            <td>{store.totalSum}</td>
          </tr>
          <tr>
            <td>Top Performer:</td>
            <td>{store.topPerformer ? store.topPerformer.name : ''}</td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

@observer class Controls extends Component {
  addDeveloper = () => {
    const name = prompt("the name:");
    const points = parseInt(prompt("The points:"), 10);
    this.props.store.addDeveloper({name, points});
  }

  removeLastDeveloper = () => { this.props.store.removeLastDeveloper();
  }

  clearList = () => { this.props.store.clearList(); }

  filterDevelopers = ({ target: { value } }) => {
    this.props.store.updateFilter(value);
  }

  render() {
    return (
      <div className="controls">
        <button onClick={this.clearList}>Clear Table</button>
        <button onClick={this.addDeveloper}>Add Developer</button>
        <button onClick={this.removeLastDeveloper}>Remove Last Developer</button>
        <input value={this.props.store.filter} onChange={this.filterDevelopers}></input>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <h1>Record Table</h1>
        <Controls store={appStore} />
        <Table store={appStore} />
      </div>
    )
  }
}




ReactDOM.render(<App store ={Store} />, document.getElementById('root'));

serviceWorker.unregister();
