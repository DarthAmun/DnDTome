import '../assets/css/App.css';
import React, { Component } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router';

import SpellOverview from './spell/SpellOverview';
import CharOverview from './char/CharOverview';
import ItemOverview from './item/ItemOverview';
import MitemOverview from './mitem/MitemOverview';
import MonsterOverview from './monster/MonsterOverview';

import CharView from './char/CharView';

import Home from './Home';
import Options from './Options';

import AddSpell from './add/AddSpell';
import AddItem from './add/AddItem';
import AddMonster from './add/AddMonster';
import AddChar from './add/AddChar';

import LeftNav from './LeftNav';
import TopNav from './TopNav';
import Notification from './Notification';

import packageJson from '../../package.json'

class PageLayout extends Component {

  catchDrop = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <div className="App" onDrop={e => catchDrop}>
        <Notification />
        <LeftNav />
        <div id="content">
          <TopNav />
          {this.props.children}
        </div>
        <div id="credits">v{packageJson.version} by DarthAmun</div>
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
          <Route path="/mitem-overview" render={() => {
            return <PageLayout><MitemOverview /></PageLayout>
          }} />
          <Route path="/monster-overview" render={() => {
            return <PageLayout><MonsterOverview /></PageLayout>
          }} />
          <Route path="/char-overview" render={() => {
            return <PageLayout><CharOverview /></PageLayout>
          }} />
          <Route path="/char/:id" render={props => {
            return <PageLayout><CharView {...props} /></PageLayout>
          }} />
          <Route path="/add-spell" render={() => {
            return <PageLayout><AddSpell /></PageLayout>
          }} />
          <Route path="/add-item" render={() => {
            return <PageLayout><AddItem /></PageLayout>
          }} />
          <Route path="/add-monster" render={() => {
            return <PageLayout><AddMonster /></PageLayout>
          }} />
          <Route path="/add-char" render={() => {
            return <PageLayout><AddChar /></PageLayout>
          }} />
          <Route path="/options" render={() => {
            return <PageLayout><Options /></PageLayout>
          }} />
          <Route path="/" render={() => {
            return <div className="App homeDrag">
              <div id="content">
                <Home />
              </div>
              <div id="credits">v{packageJson.version} by DarthAmun</div>
            </div>
          }} />
        </Switch>
      </MemoryRouter>
    );
  }
}

export default App;