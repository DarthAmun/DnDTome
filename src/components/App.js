import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
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
import OptionService from '../database/OptionService';

export function PageLayout(props) {

  const catchDrop = (e) => {
    e.preventDefault();
  }

  return (
    <div className={`App_${props.theme}`} onDrop={e => catchDrop}>
      <Notification />
      <LeftNav />
      <div id="content">
        <TopNav />
        {props.children}
      </div>
      <div id="credits">v{packageJson.version} by DarthAmun</div>
    </div>
  );

}

export default function App() {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    OptionService.get('theme', function (result) {
      setTheme(result);
    });
  }, []);

  return (
    <MemoryRouter>
      <Switch>
        <Route path="/spell-overview" render={() => {
          return <PageLayout theme={theme}><SpellOverview theme={theme} /></PageLayout>
        }} />
        <Route path="/item-overview" render={() => {
          return <PageLayout theme={theme}><ItemOverview theme={theme} /></PageLayout>
        }} />
        <Route path="/mitem-overview" render={() => {
          return <PageLayout theme={theme}><MitemOverview theme={theme} /></PageLayout>
        }} />
        <Route path="/monster-overview" render={() => {
          return <PageLayout theme={theme}><MonsterOverview theme={theme} /></PageLayout>
        }} />
        <Route path="/char-overview" render={() => {
          return <PageLayout theme={theme}><CharOverview theme={theme} /></PageLayout>
        }} />
        <Route path="/char/:id" render={(props) => {
          return <PageLayout theme={theme}><CharView theme={theme} {...props} /></PageLayout>
        }} />
        <Route path="/add-spell" render={() => {
          return <PageLayout theme={theme}><AddSpell theme={theme} /></PageLayout>
        }} />
        <Route path="/add-item" render={() => {
          return <PageLayout theme={theme}><AddItem theme={theme} /></PageLayout>
        }} />
        <Route path="/add-monster" render={() => {
          return <PageLayout theme={theme}><AddMonster theme={theme} /></PageLayout>
        }} />
        <Route path="/add-char" render={() => {
          return <PageLayout theme={theme}><AddChar theme={theme} /></PageLayout>
        }} />
        <Route path="/options" render={() => {
          return <PageLayout theme={theme}><Options theme={theme} /></PageLayout>
        }} />
        <Route path="/" render={() => {
          return <div className="App homeDrag">
            <div id="content">
              <Home/>
            </div>
            <div id="credits">v{packageJson.version} by DarthAmun</div>
          </div>
        }} />
      </Switch>
    </MemoryRouter>
  );
}
