import '../assets/css/App.css';
import React, { Component } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router';

import SpellOverview from './SpellOverview';
import CharOverview from './CharOverview';
import ItemOverview from './ItemOverview';
import SpellView from './SpellView';
import CharView from './CharView';
import Home from './Home';
import AddView from './AddView';
import AddSpell from './AddSpell';
import LeftNav from './LeftNav';
import TopNav from './TopNav';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class App extends Component {

  showOverview = () => {

  }

  showPage = (value) => {
    const container = docu
    if (this.state.page == 'init') {
      return <Init></Init>;
    }
  }


  render() {
    return (
      <div className="App">
        <MemoryRouter>
          <LeftNav />
          <div id="content">
            <TopNav />
            <Switch>
              <Route path="/spell-overview" component={SpellOverview} />
              <Route path="/spell-overview/:id" component={SpellView} />
              <Route path="/char-overview" component={CharOverview} />
              <Route path="/item-overview" component={ItemOverview} />
              <Route path="/add-view" component={AddView} />
              <Route path="/add-spell" component={AddSpell} />
              <Route path="/char/:id" component={CharView} />
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