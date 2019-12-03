import '../assets/css/App.css';
import React, { Component, useEffect } from 'react';
import { MemoryRouter, Switch, Route, useLocation } from 'react-router';

import SpellOverview from './spell/SpellOverview';
import ItemOverview from './item/ItemOverview';
import MonsterOverview from './monster/MonsterOverview';

import Home from './Home';
import Options from './Options';

import AddSpell from './add/AddSpell';
import AddItem from './add/AddItem';
import AddMonster from './add/AddMonster';

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
  const theme = useContext(themeContext)
  return (
    <ThemeContext.Provider value={theme}>
      <MemoryRouter>
        <Switch>
          <LayoutRoute path="/spell-overview" layout={PageLayout} component={SpellOverview} />
          <LayoutRoute path="/item-overview" layout={PageLayout} component={ItemOverview} />
          <LayoutRoute path="/monster-overview" layout={PageLayout} component={MonsterOverview} />
          <LayoutRoute path="/char/:id" layout={PageLayout} component={CharView} />
          <LayoutRoute path="/add-spell" layout={PageLayout} component={AddSpell} />
          <LayoutRoute path="/add-item" layout={PageLayout} component={AddItem} />
          <LayoutRoute path="/add-monster" layout={PageLayout} component={AddMonster} />
          <LayoutRoute path="/options" layout={PageLayout} component={Options} />
          <LayoutRoute path="/" layout={HomeLayout} component={Home} />
        </Switch>
      </MemoryRouter >
    </ThemeContext.Provider>
  );
};

export default App;
