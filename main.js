'use strict';

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');

//Database Services
const SpellService = require('./src/database/SpellService');
const ItemService = require('./src/database/ItemService');
const GearService = require('./src/database/GearService');
const MonsterService = require('./src/database/MonsterService');
const CharacterService = require('./src/database/CharacterService');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let spellWindow;
let spellPath;
let itemWindow;
let itemPath;
let gearWindow;
let gearPath;
let monsterWindow;
let monsterPath;
// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

console.log("====>" + path.join(__dirname, './src/assets/db/tab.db'));
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, './src/assets/db/tab.db'));

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 680,
    minHeight: 400,
    minWidth: 660,
    show: false,
    frame: false,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    //The lines below solved the issue
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
    spellPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'spell.html',
      slashes: true
    });
    itemPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'item.html',
      slashes: true
    });
    gearPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'gear.html',
      slashes: true
    });
    monsterPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'monster.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
    spellPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'spell.html'),
      slashes: true
    });
    itemPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'item.html'),
      slashes: true
    });
    gearPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'gear.html'),
      slashes: true
    });
    monsterPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'monster.html'),
      slashes: true
    });
  }
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.setTitle("DnD Tome");
    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    db.close();
    mainWindow = null;
    spellWindow = null;
    itemWindow = null;
    gearWindow = null;
    monsterWindow = null;
  });

  //Spell window
  spellWindow = new BrowserWindow({
    parent: mainWindow,
    width: 950,
    height: 410,
    show: false,
    resizable: false,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    //The lines below solved the issue
    webPreferences: {
      nodeIntegration: true
    }
  });
  spellWindow.setMenu(null);
  spellWindow.loadURL(spellPath);
  spellWindow.on('close', (e) => {
    e.preventDefault();
    spellWindow.hide();
  });

  //Item window
  itemWindow = new BrowserWindow({
    parent: mainWindow,
    width: 800,
    height: 520,
    show: false,
    resizable: false,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    //The lines below solved the issue
    webPreferences: {
      nodeIntegration: true
    }
  });
  itemWindow.setMenu(null);
  itemWindow.loadURL(itemPath);
  itemWindow.on('close', (e) => {
    e.preventDefault();
    itemWindow.hide();
  });

  //Gear window
  gearWindow = new BrowserWindow({
    parent: mainWindow,
    width: 645,
    height: 385,
    show: false,
    resizable: false,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    //The lines below solved the issue
    webPreferences: {
      nodeIntegration: true
    }
  });
  gearWindow.setMenu(null);
  gearWindow.loadURL(gearPath);
  gearWindow.on('close', (e) => {
    e.preventDefault();
    gearWindow.hide();
  });

  //Monster window
  monsterWindow = new BrowserWindow({
    parent: mainWindow,
    width: 915,
    height: 750,
    show: false,
    resizable: true,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });
  monsterWindow.setMenu(null);
  monsterWindow.loadURL(monsterPath);
  monsterWindow.on('close', (e) => {
    e.preventDefault();
    monsterWindow.hide();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const deleteAll = (tab) => {
  db.serialize(function () {
    db.run(`DELETE FROM tab_characters_${tab}`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_${tab} successful deleted`);
      mainWindow.webContents.send('displayMessage', { type: `Delete All ${tab}`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_${tab}'`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_${tab} autoincreasement reseted successful`);
    });
    db.run(`DELETE FROM tab_${tab}`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from ${tab} successful deleted`);
      mainWindow.webContents.send('displayMessage', { type: `Delete All ${tab}`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_${tab}'`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> ${tab} autoincreasement reseted successful`);
    });
  });
}

ipcMain.on('getAllSpells', (event) => {
  SpellService.reciveAllSpells(mainWindow);
});

ipcMain.on('getAllItems', (event) => {
  ItemService.reciveAllItems(mainWindow);
});

ipcMain.on('getAllGears', (event) => {
  GearService.reciveAllGears(mainWindow);
});

ipcMain.on('getAllMonsters', (event) => {
  MonsterService.reciveAllMonsters(mainWindow);
});

ipcMain.on('getAllChars', (event) => {
  CharacterService.reciveAllChars(mainWindow);
});

ipcMain.on('getSearchSpells', (event, arg) => {
  const { step, start } = arg;
  this.searchSpellStep = step;
  SpellService.reciveSpells(step, start, null, mainWindow);
});

ipcMain.on('getSearchItems', (event, arg) => {
  const { step, start } = arg;
  this.searchItemStep = step;
  ItemService.reciveItems(step, start, null, mainWindow);
});
ipcMain.on('getSearchGears', (event, arg) => {
  const { step, start } = arg;
  this.searchGearStep = step;
  GearService.reciveGears(step, start, null, mainWindow);
});

ipcMain.on('getSearchMonsters', (event, arg) => {
  const { step, start } = arg;
  this.searchMonsterStep = step;
  MonsterService.reciveMonsters(step, start, null, mainWindow);
});

ipcMain.on('getSpellCount', (event, arg) => {
  SpellService.reciveSpellCount(`SELECT count(*) AS count FROM 'main'.'tab_spells'`, mainWindow);
});

ipcMain.on('getItemCount', (event, arg) => {
  ItemService.reciveItemCount(`SELECT count(*) AS count FROM 'main'.'tab_items'`, mainWindow);
});

ipcMain.on('getGearCount', (event, arg) => {
  GearService.reciveGearCount(`SELECT count(*) AS count FROM 'main'.'tab_gears'`, mainWindow);
});


ipcMain.on('getMonsterCount', (event, arg) => {
  MonsterService.reciveMonsterCount(`SELECT count(*) AS count FROM 'main'.'tab_monsters'`, mainWindow);
});

ipcMain.on('sendSpellSearchQuery', (event, arg) => {
  const { query } = arg;
  const q = SpellService.reciveSpells(this.searchSpellStep, 0, query, mainWindow);
  SpellService.reciveSpellCount(q.replace("SELECT * FROM 'main'.'tab_spells'", "SELECT count(*) AS count FROM 'main'.'tab_spells'"), mainWindow);
});

ipcMain.on('sendItemSearchQuery', (event, arg) => {
  const { query } = arg;
  const q = ItemService.reciveItems(this.searchItemStep, 0, query, mainWindow);
  ItemService.reciveItemCount(q.replace("SELECT * FROM 'main'.'tab_items'", "SELECT count(*) AS count FROM 'main'.'tab_items'"), mainWindow);
});

ipcMain.on('sendMonsterSearchQuery', (event, arg) => {
  const { query } = arg;
  const q = MonsterService.reciveMonsters(this.searchMonsterStep, 0, query, mainWindow);
  MonsterService.reciveMonsterCount(q.replace("SELECT * FROM 'main'.'tab_monsters'", "SELECT count(*) AS count FROM 'main'.'tab_monsters'"), mainWindow);
});

ipcMain.on('getSpell', (event, arg) => {
  const { id } = arg;
  SpellService.reciveSpell(id, mainWindow);
});

ipcMain.on('saveSpell', (event, arg) => {
  const { spell } = arg;
  SpellService.saveSpell(spell, mainWindow);
});

ipcMain.on('saveItem', (event, arg) => {
  const { item } = arg;
  ItemService.saveItem(item, mainWindow);
});

ipcMain.on('saveGear', (event, arg) => {
  console.log("save event");
  const { gear } = arg;
  GearService.saveGear(gear, mainWindow);
});

ipcMain.on('saveMonster', (event, arg) => {
  const { monster } = arg;
  MonsterService.saveMonster(monster, mainWindow);
});

ipcMain.on('saveChar', (event, arg) => {
  const { char } = arg;
  CharacterService.saveChar(char, mainWindow);
});
ipcMain.on('saveNewChar', (event, arg) => {
  const { char } = arg;
  CharacterService.saveNewChar(char, mainWindow);
});
ipcMain.on('saveCharItems', (event, arg) => {
  const { items } = arg;
  CharacterService.saveCharItems(items);
});
ipcMain.on('saveCharSpells', (event, arg) => {
  const { spells } = arg;
  CharacterService.saveCharSpells(spells);
});

ipcMain.on('deleteSpell', (event, arg) => {
  const { spell } = arg;
  SpellService.deleteSpell(spell, mainWindow, spellWindow);
});

ipcMain.on('deleteItem', (event, arg) => {
  const { item } = arg;
  ItemService.deleteItem(item, mainWindow, itemWindow);
});

ipcMain.on('deleteGear', (event, arg) => {
  const { gear } = arg;
  GearService.deleteGear(gear, mainWindow, gearWindow);
});

ipcMain.on('deleteMonster', (event, arg) => {
  const { monster } = arg;
  MonsterService.deleteMonster(monster, mainWindow, monsterWindow);
});

ipcMain.on('saveNewSpell', (event, arg) => {
  const { spell } = arg;
  SpellService.saveNewSpell(spell, mainWindow);
});
ipcMain.on('saveNewSpells', (event, arg) => {
  const { spells } = arg;
  SpellService.saveNewSpells(spells, mainWindow);
});

ipcMain.on('saveNewItem', (event, arg) => {
  const { item } = arg;
  ItemService.saveNewItem(item, mainWindow);
});
ipcMain.on('saveNewItems', (event, arg) => {
  const { items } = arg;
  ItemService.saveNewItems(items, mainWindow);
});

ipcMain.on('saveNewGear', (event, arg) => {
  const { gear } = arg;
  GearService.saveNewGear(gear, mainWindow);
});
ipcMain.on('saveNewGears', (event, arg) => {
  const { gears } = arg;
  GearService.saveNewGears(gears, mainWindow);
});

ipcMain.on('saveNewMonster', (event, arg) => {
  const { monster } = arg;
  MonsterService.saveNewMonster(monster, mainWindow);
});
ipcMain.on('saveNewMonsters', (event, arg) => {
  const { monsters } = arg;
  MonsterService.saveNewMonsters(monsters, mainWindow);
});


ipcMain.on('saveNewChars', (event, arg) => {
  const { chars } = arg;
  CharacterService.saveNewChars(chars, mainWindow);
});

ipcMain.on('getChars', (event, arg) => {
  CharacterService.reciveChars(mainWindow, itemWindow, gearWindow, spellWindow);
});

ipcMain.on('getChar', (event, arg) => {
  const { id } = arg;
  CharacterService.reciveChar(id, mainWindow);
});

ipcMain.on('getCharSpells', (event, arg) => {
  const { id } = arg;
  CharacterService.reciveCharSpells(id, mainWindow);
});
ipcMain.on('getCharItems', (event, arg) => {
  const { id } = arg;
  CharacterService.reciveCharItems(id, mainWindow);
});

ipcMain.on('addItemToChar', (event, arg) => {
  const { char, item } = arg;
  ItemService.addItemToChar(char, item, mainWindow);
});
ipcMain.on('addGearToChar', (event, arg) => {
  const { char, gear } = arg;
  GearService.addGearToChar(char, gear, mainWindow);
});
ipcMain.on('addSpellToChar', (event, arg) => {
  const { char, spell } = arg;
  SpellService.addSpellToChar(char, spell, mainWindow);
});

ipcMain.on('deleteCharSpell', (event, arg) => {
  const { spell } = arg;
  CharacterService.deleteCharSpell(spell, mainWindow);
});
ipcMain.on('deleteCharItem', (event, arg) => {
  const { item } = arg;
  CharacterService.deleteCharItem(item, mainWindow);
});
ipcMain.on('deleteChar', (event, arg) => {
  const { id } = arg;
  CharacterService.deleteChar(id, mainWindow);
});



ipcMain.on('closeMainWindow', (event) => {
  mainWindow.close();
});

ipcMain.on('minimizeMainWindow', (event) => {
  mainWindow.minimize();
});

ipcMain.on('openSpellView', (event, spell) => {
  spellWindow.show();
  if (dev) {
    spellWindow.webContents.openDevTools();
  }
  spellWindow.setTitle("DnD Tome - " + spell.spell_name);
  spellWindow.webContents.send('onViewSpell', spell);
});

ipcMain.on('openItemView', (event, item) => {
  itemWindow.show();
  if (dev) {
    itemWindow.webContents.openDevTools();
  }
  itemWindow.setTitle("DnD Tome - " + item.item_name);
  itemWindow.webContents.send('onViewItem', item);
});

ipcMain.on('openGearView', (event, gear) => {
  gearWindow.show();
  if (dev) {
    gearWindow.webContents.openDevTools();
  }
  gearWindow.setTitle("DnD Tome - " + gear.gear_name);
  gearWindow.webContents.send('onViewGear', gear);
});

ipcMain.on('openMonsterView', (event, monster) => {
  monsterWindow.show();
  if (dev) {
    monsterWindow.webContents.openDevTools();
  }
  monsterWindow.setTitle("DnD Tome - " + monster.monster_name);
  monsterWindow.webContents.send('onViewMonster', monster);
});

ipcMain.on('deleteAllSpells', (event) => {
  deleteAll("spells");
});
ipcMain.on('deleteAllItems', (event) => {
  deleteAll("items");
});
ipcMain.on('deleteAllGears', (event) => {
  deleteAll("gears");
});
ipcMain.on('deleteAllMonsters', (event) => {
  deleteAll("monsters");
});
ipcMain.on('deleteAllChars', (event) => {
  deleteAll("characters");
});

ipcMain.on('displayMessage', (event, m) => {
  mainWindow.webContents.send('displayMessage', { type: m.type, message: m.message });
});

ipcMain.on('reloadWindows', (event) => {
  itemWindow.reload();
  gearWindow.reload();
  spellWindow.reload();
  monsterWindow.reload();
  mainWindow.reload();
});

ipcMain.on('changeTheme', (event, theme) => {
  itemWindow.webContents.send('changeTheme', { theme: theme });
  gearWindow.webContents.send('changeTheme',  { theme: theme });
  spellWindow.webContents.send('changeTheme',  { theme: theme });
  monsterWindow.webContents.send('changeTheme',  { theme: theme });
});