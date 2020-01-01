'use strict';

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');

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
let charWindow;
let charPath;
// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

console.log("====>" + path.join(__dirname, './src/assets/db/tab.db'));
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, './src/assets/db/tab.db'));

function createWindow() {

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
    charPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'char.html',
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
    charPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'char.html'),
      slashes: true
    });
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 680,
    minHeight: 400,
    minWidth: 660,
    show: false,
    frame: false,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(indexPath);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.setTitle("DnD Tome");
    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });
  mainWindow.on('closed', function () {
    db.close();
    mainWindow = null;
  });

  //Spell window
  spellWindow = new BrowserWindow({
    parent: mainWindow,
    width: 950,
    height: 450,
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
    width: 646,
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

  //Char window
   charWindow = new BrowserWindow({
    parent: mainWindow,
    width: 1000,
    height: 750,
    show: false,
    resizable: true,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });
  charWindow.setMenu(null);
  charWindow.loadURL(charPath);
  charWindow.on('close', (e) => {
    e.preventDefault();
    charWindow.hide();
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

const deleteAllCharacters = () => {
  db.serialize(function () {
    db.run(`DELETE FROM tab_characters_spells`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_spells successful deleted`);
      mainWindow.webContents.send('displayMessage', { type: `Delete All character spells`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_spells'`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_spells autoincreasement reseted successful`);
    });

    db.run(`DELETE FROM tab_characters_items`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_items successful deleted`);
      mainWindow.webContents.send('displayMessage', { type: `Delete All character items`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_items'`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_sitems autoincreasement reseted successful`);
    });

    db.run(`DELETE FROM tab_characters_monsters`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_monsters successful deleted`);
      mainWindow.webContents.send('displayMessage', { type: `Delete All character monsters`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_monsters'`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_monsters autoincreasement reseted successful`);
    });

    db.run(`DELETE FROM tab_characters`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters successful deleted`);
      mainWindow.webContents.send('displayMessage', { type: `Delete All characters`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters'`, function (err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters autoincreasement reseted successful`);
    });
  });
}

ipcMain.on('sendSpellSearchQuery', (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send('sendSpellSearchQuery', { query });
});
ipcMain.on('sendItemSearchQuery', (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send('sendItemSearchQuery', { query });
});

ipcMain.on('sendGearSearchQuery', (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send('sendGearSearchQuery', { query });
});

ipcMain.on('sendMonsterSearchQuery', (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send('sendMonsterSearchQuery', { query });
});

ipcMain.on('closeMainWindow', (event) => {
  mainWindow.close();
});

ipcMain.on('minimizeMainWindow', (event) => {
  mainWindow.minimize();
});

ipcMain.on('openSpellView', (event, spell) => {
  if (dev) {
    spellWindow.webContents.openDevTools();
  }
  spellWindow.setTitle("DnD Tome - " + spell.spell_name);
  spellWindow.webContents.send('onViewSpell', spell);
  spellWindow.show();
});

ipcMain.on('openItemView', (event, item) => {
  if (dev) {
    itemWindow.webContents.openDevTools();
  }
  itemWindow.setTitle("DnD Tome - " + item.item_name);
  itemWindow.webContents.send('onViewItem', item);
  itemWindow.show();
});

ipcMain.on('openGearView', (event, gear) => {
  if (dev) {
    gearWindow.webContents.openDevTools();
  }
  gearWindow.setTitle("DnD Tome - " + gear.gear_name);
  gearWindow.webContents.send('onViewGear', gear);
  gearWindow.show();
});

ipcMain.on('openMonsterView', (event, monster) => {
  if (dev) {
    monsterWindow.webContents.openDevTools();
  }
  monsterWindow.setTitle("DnD Tome - " + monster.monster_name);
  monsterWindow.webContents.send('onViewMonster', monster);
  monsterWindow.show();
});

ipcMain.on('openCharView', (event, char) => {
  if (dev) {
    charWindow.webContents.openDevTools();
  }
  charWindow.setTitle("DnD Tome - " + char.char_name);
  charWindow.webContents.send('onViewChar', char);
  charWindow.show();
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
  deleteAllCharacters();
});

ipcMain.on('spellsUpdated', (event, arg) => {
  const { spellStep, spellStart } = arg;
  mainWindow.webContents.send('spellsUpdated', { spellStep, spellStart });
});
ipcMain.on('itemsUpdated', (event, arg) => {
  const { itemStep, itemStart } = arg;
  mainWindow.webContents.send('itemsUpdated', { itemStep, itemStart });
});
ipcMain.on('gearsUpdated', (event, arg) => {
  const { gearStep, gearStart } = arg;
  mainWindow.webContents.send('gearsUpdated', { gearStep, gearStart });
});
ipcMain.on('monstersUpdated', (event, arg) => {
  const { monsterStep, monsterStart } = arg;
  mainWindow.webContents.send('monstersUpdated', { monsterStep, monsterStart });
});


ipcMain.on('displayMessage', (event, m) => {
  mainWindow.webContents.send('displayMessage', { type: m.type, message: m.message });
});

ipcMain.on('changeTheme', (event, theme) => {
  itemWindow.webContents.send('changeTheme', { theme: theme });
  gearWindow.webContents.send('changeTheme', { theme: theme });
  spellWindow.webContents.send('changeTheme', { theme: theme });
  monsterWindow.webContents.send('changeTheme', { theme: theme });
  charWindow.webContents.send('changeTheme', { theme: theme });
});
