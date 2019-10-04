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
      <MemoryRouter>
        <Switch>
          <Route path="/spell-overview" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <SpellOverview />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/item-overview" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <ItemOverview />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/monster-overview" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <MonsterOverview />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/char-overview" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <CharOverview />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/char/:id" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <CharView />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/add-view" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <AddView />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/add-spell" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <AddSpell />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/add-item" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <AddItem />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/options" render={() => {
            return <div className="App">
              <LeftNav />
              <div id="content">
                <TopNav />
                <Option />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
          <Route path="/" render={() => {
            return <div className="App">
              <div id="content">
                <Home />
              </div>
              <div id="credits">by DarthAmun</div>
            </div>
          }} />
        </Switch>
      </MemoryRouter>
    );
  }
}

export default App;