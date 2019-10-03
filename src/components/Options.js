import '../assets/css/Options.css';
import React, { Component } from 'react';
import { ipcMain } from 'electron';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog, app } = electron.remote;
const fs = require('fs');

class Options extends Component {
  state = {
    spells: [],
    items: [],
    monsters: [],
    appPath: app.getAppPath() + '\\export'
  }

  receiveAllSpells = (evt, result) => {
    this.setState({
      ...this.state,
      spells: result
    })
  }

  receiveAllItems = (evt, result) => {
    this.setState({
      ...this.state,
      items: result
    })
  }

  receiveAllMonsters = (evt, result) => {
    this.setState({
      ...this.state,
      monsters: result
    })
  }

  componentDidMount() {
    ipcRenderer.send('getAllSpells');
    ipcRenderer.send('getAllItems');
    ipcRenderer.send('getAllMonsters');
    ipcRenderer.on("getAllSpellsResult", this.receiveAllSpells);
    ipcRenderer.on("getAllItemsResult", this.receiveAllItems);
    ipcRenderer.on("getAllMonstersResult", this.receiveAllMonsters);

  }
  componentWillUnmount() {
    ipcRenderer.removeListener("getAllSpellsResult", this.receiveAllSpells);
    ipcRenderer.removeListener("getAllItemsResult", this.receiveAllItems);
    ipcRenderer.removeListener("getAllMonstersResult", this.receiveAllMonsters)
  }

  exportSpells = (e) => {
    let content = JSON.stringify(this.state.spells);

    let fileName = this.state.appPath;
    if (!fs.existsSync(fileName)) {
      fs.mkdirSync(fileName);
      console.log("Export folder created!");
    }
    fileName = fileName + '\\spells.json';
    console.log(fileName);
    // fileName is a string that contains the path and filename created in the save file dialog.  
    fs.writeFile(fileName, content, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message)
      }
      alert("The file has been succesfully saved");
    });
  }

  exportItems = (e) => {
    let content = JSON.stringify(this.state.items);

    let fileName = this.state.appPath;
    if (!fs.existsSync(fileName)) {
      fs.mkdirSync(fileName);
      console.log("Export folder created!");
    }
    fileName = fileName + '\\items.json';
    console.log(fileName);
    // fileName is a string that contains the path and filename created in the save file dialog.  
    fs.writeFile(fileName, content, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message)
      }
      alert("The file has been succesfully saved");
    });
  }

  exportMonsters = (e) => {
    let content = JSON.stringify(this.state.monsters);

    let fileName = this.state.appPath;
    if (!fs.existsSync(fileName)) {
      fs.mkdirSync(fileName);
      console.log("Export folder created!");
    }
    fileName = fileName + '\\monsters.json';
    console.log(fileName);
    // fileName is a string that contains the path and filename created in the save file dialog.  
    fs.writeFile(fileName, content, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message)
      }
      alert("The file has been succesfully saved");
    });
  }

  importSpells = (e) => {
    dialog.showOpenDialog((fileNames) => {
      // fileNames is an array that contains all the selected
      if (fileNames === undefined) {
        console.log("No file selected");
        return;
      }

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }

        // Change how to handle the file content
        let spells = JSON.parse(data);
        ipcRenderer.send('saveNewSpells', { spells });
      });
    });
  }

  importItems = (e) => {
    dialog.showOpenDialog((fileNames) => {
      // fileNames is an array that contains all the selected
      if (fileNames === undefined) {
        console.log("No file selected");
        return;
      }

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }

        // Change how to handle the file content
        let items = JSON.parse(data);
        ipcRenderer.send('saveNewItems', { items }); // fehlt noch
      });
    });
  }

  importMonsters = (e) => {
    dialog.showOpenDialog((fileNames) => {
      // fileNames is an array that contains all the selected
      if (fileNames === undefined) {
        console.log("No file selected");
        return;
      }

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }

        // Change how to handle the file content
        let monsters = JSON.parse(data);
        ipcRenderer.send('saveNewMonsters', { monsters }); // fehlt noch
      });
    });
  }

  render() {
    return (
      <div id="overview">
        <div id="optionContent">
          <div id="options">
            <div className="optionSection">
              <h3>Data Export</h3>
              <span>Path: {this.state.appPath}</span><br />
              <button onClick={this.exportSpells}>Export all Spells </button><br />
              <button onClick={this.exportItems}>Export all Items </button><br />
              <button onClick={this.exportMonsters}>Export all Monsters </button><br />
              <button onClick={this.exportItems}>Export all Charakters </button>
            </div>
            <div className="optionSection">
              <h3>Data Import</h3>
              <button onClick={this.importSpells}>Import Spells </button><br />
              <button onClick={this.importItems}>Import Items </button><br />
              <button onClick={this.importMonsters}>Import Monsters </button><br />
              <button onClick={this.importItems}>Import Charakters </button>
            </div>
            <div className="optionSection">
              <h3>Delete Data</h3>
              <button onClick={this.importSpells}>Delete all Spells </button><br />
              <button onClick={this.importItems}>Delete all Items </button><br />
              <button onClick={this.importItems}>Delete all Monsters </button><br />
              <button onClick={this.importItems}>Delete all Charakters </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Options;