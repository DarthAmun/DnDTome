import '../assets/css/App.css';
import React, { useEffect } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router';
import ThemeService from '../services/ThemeService';
import OptionService from '../database/OptionService';

import SpellOverview from './spell/SpellOverview';
import ItemOverview from './item/ItemOverview';
import GearOverview from './gear/GearOverview';
import MonsterOverview from './monster/MonsterOverview';
import CharOverview from './char/CharOverview';

import Home from './Home';
import Options from './Options';

import AddSpell from './add/AddSpell';
import AddChar from './add/AddChar';
import AddItem from './add/AddItem';
import AddMonster from './add/AddMonster';
import AddGear from './add/AddGear';

import CharView from './char/CharView';

import LeftNav from './LeftNav';
import TopNav from './TopNav';

const PageLayout = ({ children }) => (
  <div className="App">
    <LeftNav />
    <div id="content">
      <TopNav />
      {children}
    </div>
    <div id="credits">by DarthAmun</div>
  </div>
);

const HomeLayout = ({ children }) => (
  <div className="App homeDrag">
    <div id="content">{children}</div>
    <div id="credits">by DarthAmun</div>
  </div>
);

const LayoutRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
);

const App = () => {

  useEffect(() => {
    OptionService.get('theme', function (result) {
      ThemeService.setTheme(result);
      ThemeService.applyTheme(result);
    });
  }, []);

  return (
    <MemoryRouter>
      <Switch>
        <LayoutRoute path="/spell-overview" layout={PageLayout} component={SpellOverview} />
        <LayoutRoute path="/item-overview" layout={PageLayout} component={ItemOverview} />
        <LayoutRoute path="/gear-overview" layout={PageLayout} component={GearOverview} />
        <LayoutRoute path="/monster-overview" layout={PageLayout} component={MonsterOverview} />
        <LayoutRoute path="/char-overview" layout={PageLayout} component={CharOverview} />
        <LayoutRoute path="/char/:id" layout={PageLayout} component={CharView} />
        <LayoutRoute path="/add-char" layout={PageLayout} component={AddChar} />
        <LayoutRoute path="/add-spell" layout={PageLayout} component={AddSpell} />
        <LayoutRoute path="/add-item" layout={PageLayout} component={AddItem} />
        <LayoutRoute path="/add-gear" layout={PageLayout} component={AddGear} />
        <LayoutRoute path="/add-monster" layout={PageLayout} component={AddMonster} />
        <LayoutRoute path="/options" layout={PageLayout} component={Options} />
        <LayoutRoute path="/" layout={HomeLayout} component={Home} />
      </Switch>
    </MemoryRouter >
  );
};

export default App;
