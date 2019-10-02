import '../assets/css/App.css';
import React, { Component } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router';

import SpellOverview from './spell/SpellOverview';
import CharOverview from './char/CharOverview';
import ItemOverview from './item/ItemOverview';
import MonsterOverview from './monster/MonsterOverview';

import CharView from './char/CharView';

import Home from './Home';
import Options from './Options';

import AddView from './add/AddView';
import AddSpell from './add/AddSpell';
import AddItem from './add/AddItem';

import LeftNav from './LeftNav';
import TopNav from './TopNav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MemoryRouter>
          <LeftNav />
          <div id="content">
            <TopNav />
            <Switch>
              <Route path="/spell-overview" component={SpellOverview} />
              <Route path="/item-overview" component={ItemOverview} />
              <Route path="/monster-overview" component={MonsterOverview} />
              <Route path="/char-overview" component={CharOverview} />
              <Route path="/char/:id" component={CharView} />
              <Route path="/add-view" component={AddView} />
              <Route path="/add-spell" component={AddSpell} />
              <Route path="/add-item" component={AddItem} />
              <Route path="/options" component={Options} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </MemoryRouter>
        <div id="credits">by DarthAmun</div>
      </div>
    );
  }
}

export default App;