import '../assets/css/Options.css';
import React, { useState, useEffect } from 'react';
import OptionService from '../database/OptionService';
import ThemeService from '../services/ThemeService';
import { reciveAllSpells, saveNewSpells, addSpellToChar, saveNewSpellFromJson, reciveSpellByName, deleteAllSpells } from '../database/SpellService';
import { reciveAllItems, saveNewItems, reciveItemByName, addItemToChar, saveNewItemFromJson, deleteAllItems } from '../database/ItemService';
import { reciveAllGears, saveNewGears, addGearToCharFromJson, reciveGearByName, saveNewGearFromJson, deleteAllGear } from '../database/GearService';
import { reciveAllMonsters, saveNewMonsters, reciveMonstersByCertainName, addMonsterToChar, saveNewMonsterFromJson, deleteAllMonsters } from '../database/MonsterService';
import { reciveAllChars, saveNewCharFromJson, reciveCharSpells, reciveCharItems, reciveCharMonsters, deleteAllCharacters } from '../database/CharacterService';
import { reciveAllRaces, importRacePerks, reciveRacePerks, saveNewRaceFromJson, deleteAllRaces } from '../database/RaceService';
import { Line } from 'rc-progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPatreon, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faFileExport, faFileImport, faTrashAlt, faPalette } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const { shell } = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog, app } = electron.remote;
const fs = require('fs');

export default function Options() {
  const [spellsImported, setSpellsImported] = useState({ percent: 0, now: 0, full: 0, name: "" });
  const [itemsImported, setItemsImported] = useState({ percent: 0, now: 0, full: 0, name: "" });
  const [gearsImported, setGearsImported] = useState({ percent: 0, now: 0, full: 0, name: "" });
  const [monstersImported, setMonstersImported] = useState({ percent: 0, now: 0, full: 0, name: "" });
  const [racesImported, setRacesImported] = useState({ percent: 0, now: 0, full: 0, name: "" });

  const [importing, setImporting] = useState("none");

  const [races, setRaces] = useState([]);

  const updateSpellImport = (result) => {
    let percent = Math.round((result.now / result.full) * 100);
    percent !== 0 && percent !== 100 ? setImporting("block") : setImporting("none");
    setSpellsImported({ percent: percent, now: result.now, full: result.full, name: result.name });
  }
  const updateItemImport = (result) => {
    let percent = Math.round((result.now / result.full) * 100);
    percent !== 0 && percent !== 100 ? setImporting("block") : setImporting("none");
    setItemsImported({ percent: percent, now: result.now, full: result.full, name: result.name });
  }
  const updateGearImport = (result) => {
    let percent = Math.round((result.now / result.full) * 100);
    percent !== 0 && percent !== 100 ? setImporting("block") : setImporting("none");
    setGearsImported({ percent: percent, now: result.now, full: result.full, name: result.name });
  }
  const updateMonsterImport = (result) => {
    let percent = Math.round((result.now / result.full) * 100);
    percent !== 0 && percent !== 100 ? setImporting("block") : setImporting("none");
    setMonstersImported({ percent: percent, now: result.now, full: result.full, name: result.name });
  }
  const updateRaceImport = (result) => {
    let percent = Math.round((result.now / result.full) * 100);
    percent !== 0 && percent !== 100 ? setImporting("block") : setImporting("none");
    setRacesImported({ percent: percent, now: result.now, full: result.full, name: result.name });
  }

  const toPatreon = () => {
    shell.openExternal("https://www.patreon.com/bePatron?u=25310394");
  }
  const toDiscord = () => {
    shell.openExternal("https://discord.gg/2KB3tzG");
  }

  const options = {
    defaultPath: app.getPath('documents')
  }

  useEffect(() => {
    exportRaces();
  }, []);

  const exportSpells = (e) => {
    reciveAllSpells(function (result) {
      let content = JSON.stringify(result);

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
    });
  }

  const exportItems = (e) => {
    reciveAllItems(function (result) {
      let content = JSON.stringify(result);

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
    });
  }

  const exportGears = (e) => {
    reciveAllGears(function (result) {
      let content = JSON.stringify(result);

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
    });
  }

  const exportMonsters = (e) => {
    reciveAllMonsters(function (result) {
      let content = JSON.stringify(result);

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
    });
  }

  const exportRaces = (e) => {
    reciveAllRaces(function (result) {
      result.forEach(race => {
        reciveRacePerks(race.race_id, function (perks) {
          setRaces(races => [...races, { race, perks }]);
        });
      });
    });
  }

  const exportChars = (e) => {
    reciveAllChars(function (result) {
      result.forEach(char => {
        reciveCharSpells(char.char_id, function (spells) {
          reciveCharItems(char.char_id, function (items) {
            reciveCharMonsters(char.char_id, function (monsters) {
              let completeChar = { char, monsters, spells, items };
              let content = JSON.stringify(completeChar);

              options.defaultPath = options.defaultPath + '/' + char.char_name + '_export.json';
              dialog.showSaveDialog(null, options, (path) => {

                // fileName is a string that contains the path and filename created in the save file dialog.  
                fs.writeFile(path, content, (err) => {
                  if (err) {
                    ipcRenderer.send('displayMessage', { type: `Chars exported`, message: `Chars export failed` });
                  }
                  ipcRenderer.send('displayMessage', { type: `Chars exported`, message: `Chars export successful` });
                });
              });
            });
          });
        });
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
        saveNewSpells(spellsJson, function (result) {
          updateSpellImport(result);
        });
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
        saveNewItems(itemsJson, function (result) {
          updateItemImport(result);
        });
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
        saveNewGears(gearsJson, function (result) {
          updateGearImport(result);
        });
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
        saveNewMonsters(monstersJson, function (result) {
          updateMonsterImport(result);
        });
      });
    });
  }

  const importRaces = (e) => {
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
        let racesJson = JSON.parse(data);
        racesJson.forEach(raceJson => {
          saveNewRaceFromJson(raceJson, function (result) {
            importRacePerks(result.perks, result.id);
          });
        })
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
        saveNewCharFromJson(charsJson.char, function (charId) {
          let char = { ...charsJson.char, selectedChar: charId };

          importCharSpells(charsJson.spells, char, 0, function () {
            importCharMonsters(charsJson.monsters, char, 0, function () {
              importCharItems(charsJson.items, char, 0, function () {
                console.log("====> Char import done");
              });
            });
          });
        });
      });
    });
  }

  const importCharSpells = (charSpells, char, step, callback) => {
    if (charSpells.length !== undefined && charSpells.length > step) {
      let spell = charSpells[step];
      reciveSpellByName(spell.spell_name, function (spells) {
        if (spells === undefined) {
          saveNewSpellFromJson(spell, function (spellId) {
            spell = { ...spell, id: spellId };
            addSpellToChar(char, spell, function () {
              importCharSpells(charSpells, char, (step + 1), callback);
            });
          });
        } else {
          ipcRenderer.send('displayMessage', { type: `Spell not imported`, message: `Spell ${spell.spell_name} already in tome.` });
          addSpellToChar(char, spells, function () {
            importCharSpells(charSpells, char, (step + 1), callback);
          });
        }
      });
    } else {
      callback();
    }
  }

  const importCharMonsters = (charMonsters, char, step, callback) => {
    if (charMonsters.length !== undefined && charMonsters.length > step) {
      let monster = charMonsters[step];
      reciveMonstersByCertainName(monster.monster_name, function (monsters) {
        if (monsters === undefined) {
          saveNewMonsterFromJson(monster, function (monsterId) {
            monster = { ...monster, id: monsterId };
            addMonsterToChar(char, monster, function () {
              importCharMonsters(charMonsters, char, (step + 1), callback);
            });
          });
        } else {
          ipcRenderer.send('displayMessage', { type: `Monster not imported`, message: `Monster ${monster.monster_name} already in tome.` });
          addMonsterToChar(char, monsters, function () {
            importCharMonsters(charMonsters, char, (step + 1), callback);
          });
        }
      });
    } else {
      console.log("Next...");
      callback();
    }
  }

  const importCharItems = (charItems, char, step, callback) => {
    if (charItems.length !== undefined && charItems.length > step) {
      let item = charItems[step];
      if (item.item_id !== null) {
        reciveItemByName(item.item_name, function (items) {
          if (items === undefined) {
            saveNewItemFromJson(item, function (itemId) {
              item = { ...item, id: itemId };
              addItemToChar(char, item, function () {
                importCharItems(charItems, char, (step + 1), callback);
              });
            });
          } else {
            ipcRenderer.send('displayMessage', { type: `Item not imported`, message: `Item ${item.item_name} already in tome.` });
            addItemToChar(char, items, function () {
              importCharItems(charItems, char, (step + 1), callback);
            });
          }
        });
      } else {
        reciveGearByName(item.gear_name, function (gears) {
          if (gears === undefined) {
            saveNewGearFromJson(item, function (gearId) {
              let gear = { ...item, id: gearId };
              addGearToCharFromJson(char, gear, function () {
                importCharItems(charItems, char, (step + 1), callback);
              });
            });
          } else {
            ipcRenderer.send('displayMessage', { type: `Gear not imported`, message: `Gear ${item.gear_name} already in tome.` });
            addGearToCharFromJson(char, gears, function () {
              importCharItems(charItems, char, (step + 1), callback);
            });
          }
        });
      }
    } else {
      console.log("Next...");
      callback();
    }
  }

  const deleteAllItemsAction = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all magic items?`,
      message: 'All magic items will be deleted and removed from all characters!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        deleteAllItems();
      }
    });
  }
  const deleteAllGearsAction = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all gear?`,
      message: 'All gear will be deleted and removed from all characters!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        deleteAllGear();
      }
    });
  }
  const deleteAllSpellsAction = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all spells?`,
      message: 'All spells will be deleted and removed from all characters!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        deleteAllSpells();
      }
    });
  }
  const deleteAllMonstersAction = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all monsters?`,
      message: 'All monsters will be deleted!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        deleteAllMonsters();
      }
    });
  }
  const deleteAllRacesAction = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all races?`,
      message: 'All races will be deleted!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        deleteAllRaces();
      }
    });
  }
  const deleteAllCharsAction = () => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: `Delete all characters?`,
      message: 'All characters will be deleted!'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        deleteAllCharacters();
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

  const exportRacesAction = () => {
    let content = JSON.stringify(races);

    options.defaultPath = options.defaultPath + '/races_export.json';
    dialog.showSaveDialog(null, options, (path) => {

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(path, content, (err) => {
        if (err) {
          ipcRenderer.send('displayMessage', { type: `Races exported`, message: `Race export failed` });
        }
        ipcRenderer.send('displayMessage', { type: `Races exported`, message: `Race export successful` });
      });
    });
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
            <button onClick={exportItems}><FontAwesomeIcon icon={faFileExport} /> Export all Magic Items </button><br />
            <button onClick={exportGears}><FontAwesomeIcon icon={faFileExport} /> Export all Gear </button><br />
            <button onClick={exportMonsters}><FontAwesomeIcon icon={faFileExport} /> Export all Monsters </button><br />
            <button onClick={exportChars}><FontAwesomeIcon icon={faFileExport} /> Export all Characters </button><br />
            <button onClick={exportRacesAction}><FontAwesomeIcon icon={faFileExport} /> Export all Races </button>
          </div>
          <div className="optionSection">
            <h3>Data Import</h3>
            <button onClick={importSpells}><FontAwesomeIcon icon={faFileImport} /> Import Spells </button><br />
            <button onClick={importItems}><FontAwesomeIcon icon={faFileImport} /> Import Magic Items </button><br />
            <button onClick={importGears}><FontAwesomeIcon icon={faFileImport} /> Import Gear </button><br />
            <button onClick={importMonsters}><FontAwesomeIcon icon={faFileImport} /> Import Monsters </button><br />
            <button onClick={importChars}><FontAwesomeIcon icon={faFileImport} /> Import Characters </button><br />
            <button onClick={importRaces}><FontAwesomeIcon icon={faFileImport} /> Import Races </button>
          </div>
          <div className="optionSection">
            <h3>Delete Data</h3>
            <button onClick={deleteAllSpellsAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Spells </button><br />
            <button onClick={deleteAllItemsAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Magic Items </button><br />
            <button onClick={deleteAllGearsAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Gear </button><br />
            <button onClick={deleteAllMonstersAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Monsters </button><br />
            <button onClick={deleteAllCharsAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Characters </button><br />
            <button onClick={deleteAllRacesAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete all Races </button>
          </div>
        </div>
      </div>
      <div className="loadingScreen" style={{ display: importing }}>
        <div className="loadingTab">
          {spellsImported.percent !== 0 && spellsImported.percent !== 100 ?
            (<div>Imported {spellsImported.percent}% ({spellsImported.now}/{spellsImported.full}) of spells.
              <Line percent={spellsImported.percent} strokeWidth="1" trailWidth="1" strokeColor="#8000ff" />
              Importing {spellsImported.name} ...
              </div>) : (<div></div>)
          }
          {gearsImported.percent !== 0 && gearsImported.percent !== 100 ?
            (<div>Imported {gearsImported.percent}% ({gearsImported.now}/{gearsImported.full}) of gear.
              <Line percent={gearsImported.percent} strokeWidth="1" trailWidth="1" strokeColor="#8000ff" />
              Importing {gearsImported.name} ...
              </div>) : (<div></div>)
          }
          {itemsImported.percent !== 0 && itemsImported.percent !== 100 ?
            (<div>Imported {itemsImported.percent}% ({itemsImported.now}/{itemsImported.full}) of magic items.
              <Line percent={itemsImported.percent} strokeWidth="1" trailWidth="1" strokeColor="#8000ff" />
              Importing {itemsImported.name} ...
              </div>) : (<div></div>)
          }
          {monstersImported.percent !== 0 && monstersImported.percent !== 100 ?
            (<div>Imported {monstersImported.percent}% ({monstersImported.now}/{monstersImported.full}) of monsters.
              <Line percent={monstersImported.percent} strokeWidth="1" trailWidth="1" strokeColor="#8000ff" />
              Importing {monstersImported.name} ...
              </div>) : (<div></div>)
          }
          {racesImported.percent !== 0 && racesImported.percent !== 100 ?
            (<div>Imported {racesImported.percent}% ({racesImported.now}/{racesImported.full}) of races.
              <Line percent={racesImported.percent} strokeWidth="1" trailWidth="1" strokeColor="#8000ff" />
              Importing {racesImported.name} ...
              </div>) : (<div></div>)
          }
        </div>
      </div>
    </div>
  );

}
