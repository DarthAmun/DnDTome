import '../assets/css/Options.css';
import React, { useState, useEffect } from 'react';
import OptionService from '../database/OptionService';
import ThemeService from '../services/ThemeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPatreon, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faFileExport, faFileImport, faTrashAlt, faPalette } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const { shell } = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog, app } = electron.remote;
const fs = require('fs');

export default function Options() {
  const [spells, setSpells] = useState([]);
  const [items, setItems] = useState([]);
  const [gears, setGears] = useState([]);
  const [monsters, setMonsters] = useState([]);
  const [chars, setChars] = useState([]);

  const receiveAllSpells = (evt, result) => {
    setSpells(result);
  }
  const receiveAllItems = (evt, result) => {
    setItems(result);
  }
  const receiveAllGears = (evt, result) => {
    setGears(result);
  }
  const receiveAllMonsters = (evt, result) => {
    setMonsters(result);
  }
  const receiveAllChars = (evt, result) => {
    setChars(result);
  }

  useEffect(() => {
    ipcRenderer.send('getAllSpells');
    ipcRenderer.send('getAllItems');
    ipcRenderer.send('getAllGears');
    ipcRenderer.send('getAllMonsters');
    ipcRenderer.send('getAllChars');
    ipcRenderer.on("getAllSpellsResult", receiveAllSpells);
    ipcRenderer.on("getAllItemsResult", receiveAllItems);
    ipcRenderer.on("getAllGearsResult", receiveAllGears);
    ipcRenderer.on("getAllMonstersResult", receiveAllMonsters);
    ipcRenderer.on("getAllCharsResult", receiveAllChars);
    return () => {
      ipcRenderer.removeListener("getAllSpellsResult", receiveAllSpells);
      ipcRenderer.removeListener("getAllItemsResult", receiveAllItems);
      ipcRenderer.removeListener("getAllGearsResult", receiveAllGears);
      ipcRenderer.removeListener("getAllMonstersResult", receiveAllMonsters);
      ipcRenderer.removeListener("getAllCharsResult", receiveAllChars);
    }
  }, []);

  const toPatreon = () => {
    shell.openExternal("https://www.patreon.com/bePatron?u=25310394");
  }
  const toDiscord = () => {
    shell.openExternal("https://discord.gg/2KB3tzG");
  }

  const options = {
    defaultPath: app.getPath('documents')
  }

  const exportSpells = (e) => {
    let content = JSON.stringify(spells);

    options.defaultPath = options.defaultPath + '/spells_export.json';
    dialog.showSaveDialog(null, options, (path) => {

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(path, content, (err) => {
        if (err) {
          ipcRenderer.send('displayMessage', { type: `Spells exported`, message: `Spell export failed` });
        }
        ipcRenderer.send('displayMessage', { type: `Spells exported`, message: `Spell export successful` });
      });
    });
  }

  const exportItems = (e) => {
    let content = JSON.stringify(items);

    options.defaultPath = options.defaultPath + '/items_export.json';
    dialog.showSaveDialog(null, options, (path) => {

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(path, content, (err) => {
        if (err) {
          ipcRenderer.send('displayMessage', { type: `Items exported`, message: `Item export failed` });
        }
        ipcRenderer.send('displayMessage', { type: `Items exported`, message: `Item export successful` });
      });
    });
  }

  const exportGears = (e) => {
    let content = JSON.stringify(gears);

    options.defaultPath = options.defaultPath + '/gear_export.json';
    dialog.showSaveDialog(null, options, (path) => {

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(path, content, (err) => {
        if (err) {
          ipcRenderer.send('displayMessage', { type: `Gear exported`, message: `Gear export failed` });
        }
        ipcRenderer.send('displayMessage', { type: `Gear exported`, message: `Gear export successful` });
      });
    });
  }

  const exportMonsters = (e) => {
    let content = JSON.stringify(monsters);

    options.defaultPath = options.defaultPath + '/monsters_export.json';
    dialog.showSaveDialog(null, options, (path) => {

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(path, content, (err) => {
        if (err) {
          ipcRenderer.send('displayMessage', { type: `Monsters exported`, message: `Monster export failed` });
        }
        ipcRenderer.send('displayMessage', { type: `Monsters exported`, message: `Monster export successful` });
      });
    });
  }

  const exportChars = (e) => {
    let content = JSON.stringify(chars);

    options.defaultPath = options.defaultPath + '/chars_export.json';
    dialog.showSaveDialog(null, options, (path) => {

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(path, content, (err) => {
        if (err) {
          ipcRenderer.send('displayMessage', { type: `Chars exported`, message: `Chars export failed` });
        }
        ipcRenderer.send('displayMessage', { type: `Chars exported`, message: `Chars export successful` });
      });
    });
  }

  const importSpells = (e) => {
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
        let spellsJson = JSON.parse(data);
        ipcRenderer.send('saveNewSpells', { spells: spellsJson });
      });
    });
  }

  const importItems = (e) => {
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
        let itemsJson = JSON.parse(data);
        ipcRenderer.send('saveNewItems', { items: itemsJson }); // fehlt noch
      });
    });
  }

  const importGears = (e) => {
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
        let gearsJson = JSON.parse(data);
        ipcRenderer.send('saveNewGears', { gears: gearsJson }); // fehlt noch
      });
    });
  }

  const importMonsters = (e) => {
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
        let monstersJson = JSON.parse(data);
        ipcRenderer.send('saveNewMonsters', { monsters: monstersJson });
      });
    });
  }

  const importChars = (e) => {
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
        let charsJson = JSON.parse(data);
        ipcRenderer.send('saveNewChars', { chars: charsJson });
      });
    });
  }

  const deleteAllItems = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all items?`,
      message: 'All items will be deleted and removed from all characters!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        ipcRenderer.send('deleteAllItems');
      }
    });
  }
  const deleteAllGears = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all gear?`,
      message: 'All gear will be deleted and removed from all characters!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        ipcRenderer.send('deleteAllGears');
      }
    });
  }
  const deleteAllSpells = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all spells?`,
      message: 'All spells will be deleted and removed from all characters!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        ipcRenderer.send('deleteAllSpells');
      }
    });
  }
  const deleteAllMonsters = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all monsters?`,
      message: 'All monsters will be deleted!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        ipcRenderer.send('deleteAllMonsters');
      }
    });
  }
  const deleteAllChars = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all characters?`,
      message: 'All characters will be deleted!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        ipcRenderer.send('deleteAllChars');
      }
    });
  }

  const darkMode = () => {
    if (ThemeService.getTheme() === 'light') {
      OptionService.set('theme', 'dark');
      ThemeService.applyTheme('dark');
      ThemeService.setTheme('dark');
    } else {
      OptionService.set('theme', 'light');
      ThemeService.applyTheme('light');
      ThemeService.setTheme('light');
    }
    ipcRenderer.send('changeTheme', ThemeService.getTheme());
  }

  return (
    <div id="overview">
      <div id="optionContent">
        <div id="options">
          <div className="optionSection">
            <h3>Want to support me?</h3>
            <button className="patreon" onClick={toPatreon}><FontAwesomeIcon icon={faPatreon} /> Become a patron</button>
          </div>
          <div className="optionSection">
            <h3>Found some bugs? Or have some feedback?</h3>
            <button className="discord" onClick={toDiscord}><FontAwesomeIcon icon={faDiscord} /> Join the discord</button>
          </div>
          <div className="optionSection">
            <h3>Theme</h3>
            <button onClick={darkMode}><FontAwesomeIcon icon={faPalette} /> Change Theme</button>
          </div>
          <div className="optionSection">
            <h3>Data Export</h3>
            <span>Path: {options.defaultPath}</span><br />
            <button onClick={exportSpells}><FontAwesomeIcon icon={faFileExport} /> Export all Spells </button><br />
            <button onClick={exportItems}><FontAwesomeIcon icon={faFileExport} /> Export all Items </button><br />
            <button onClick={exportGears}><FontAwesomeIcon icon={faFileExport} /> Export all Gear </button><br />
            <button onClick={exportMonsters}><FontAwesomeIcon icon={faFileExport} /> Export all Monsters </button><br />
            <button onClick={exportChars}><FontAwesomeIcon icon={faFileExport} /> Export all Characters </button>
          </div>
          <div className="optionSection">
            <h3>Data Import</h3>
            <button onClick={importSpells}><FontAwesomeIcon icon={faFileImport} /> Import Spells </button><br />
            <button onClick={importItems}><FontAwesomeIcon icon={faFileImport} /> Import Items </button><br />
            <button onClick={importGears}><FontAwesomeIcon icon={faFileImport} /> Import Gear </button><br />
            <button onClick={importMonsters}><FontAwesomeIcon icon={faFileImport} /> Import Monsters </button><br />
            <button onClick={importChars}><FontAwesomeIcon icon={faFileImport} /> Import Characters </button>
          </div>
          <div className="optionSection">
            <h3>Delete Data</h3>
            <button onClick={deleteAllSpells}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Spells </button><br />
            <button onClick={deleteAllItems}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Items </button><br />
            <button onClick={deleteAllGears}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Gear </button><br />
            <button onClick={deleteAllMonsters}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Monsters </button><br />
            <button onClick={deleteAllChars}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Characters </button>
          </div>
        </div>
      </div>
    </div>
  );

}
