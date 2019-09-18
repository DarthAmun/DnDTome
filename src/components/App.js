import '../assets/css/App.css';
import React, { Component } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router';

import SpellOverview from './spell/SpellOverview';
import CharOverview from './char/CharOverview';
import ItemOverview from './item/ItemOverview';
import SpellView from './spell/SpellView';
import CharView from './char/CharView';
import Home from './Home';
import AddView from './add/AddView';
import AddSpell from './add/AddSpell';
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