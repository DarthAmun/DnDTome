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

class PageLayout extends Component {
  render() {
    return (
      <div className="App">
        <LeftNav />
        <div id="content">
          <TopNav />
          {this.props.children}
        </div>
        <div id="credits">by DarthAmun</div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <MemoryRouter>
        <Switch>
          <Route path="/spell-overview" render={() => {
            return <PageLayout><SpellOverview /></PageLayout>
          }} />
          <Route path="/item-overview" render={() => {
            return <PageLayout><ItemOverview /></PageLayout>
          }} />
          <Route path="/monster-overview" render={() => {
            return <PageLayout><MonsterOverview /></PageLayout>
          }} />
          <Route path="/char-overview" render={() => {
            return <PageLayout><CharOverview /></PageLayout>
          }} />
          <Route path="/char/:id" render={() => {
            return <PageLayout><CharView /></PageLayout>
          }} />
          <Route path="/add-view" render={() => {
            return <PageLayout><AddView /></PageLayout>
          }} />
          <Route path="/add-spell" render={() => {
            return <PageLayout><AddSpell /></PageLayout>
          }} />
          <Route path="/add-item" render={() => {
            return <PageLayout><AddItem /></PageLayout>
          }} />
          <Route path="/options" render={() => {
            return <PageLayout><Option /></PageLayout>
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