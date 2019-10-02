'use strict';

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let spellWindow;
let spellPath;
let itemWindow;
let itemPath;
// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

console.log("====>" + path.join(__dirname, './src/assets/db/tab_spells.db'));
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, './src/assets/db/tab_spells.db'));

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 680,
    minHeight: 400,
    minWidth: 400,
    show: false,
    frame: false,
    icon: __dirname + './src/assets/img/dice_icon.ico'
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
  });

  //Spell window
  spellWindow = new BrowserWindow({
    parent: mainWindow,
    width: 950,
    height: 430,
    show: false,
    resizable: false,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico'
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
    height: 445,
    show: false,
    resizable: false,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico'
  });
  itemWindow.setMenu(null);
  itemWindow.loadURL(itemPath);
  itemWindow.on('close', (e) => {
    e.preventDefault();
    itemWindow.hide();
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

const reciveAllSpells = () => {
  let q = "SELECT * FROM 'main'.'tab_spells'";
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getAllSpellsResult', rows);
      console.log("====>" + `getAllSpellsResult successfull`)
    });
  });
}
const reciveAllItems = () => {
  let q = "SELECT * FROM 'main'.'tab_items'";
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getAllItemsResult', rows);
      console.log("====>" + `getAllItemsResult successfull`)
    });
  });
}

let spellStep;
let spellStart;
const reciveSpells = (step, start) => {
  spellStep = step;
  spellStart = start;
  let q = "SELECT * FROM 'main'.'tab_spells' WHERE ";
  if (this.searchSpellQuery != null) {
    if (this.searchSpellQuery.name != null && typeof this.searchSpellQuery.name !== 'undefined' && this.searchSpellQuery.name != "") {
      q += `spells_name like "%${this.searchSpellQuery.name}%" AND `;
    }
    if (this.searchSpellQuery.time != null && typeof this.searchSpellQuery.time !== 'undefined' && this.searchSpellQuery.time != "") {
      q += `spells_time like "%${this.searchSpellQuery.time}%" AND `;
    }
    if (this.searchSpellQuery.level != null && typeof this.searchSpellQuery.level !== 'undefined' && this.searchSpellQuery.level != "") {
      q += `spells_level = "${this.searchSpellQuery.level}" AND `;
    }
    if (this.searchSpellQuery.school != null && typeof this.searchSpellQuery.school !== 'undefined' && this.searchSpellQuery.school != "") {
      q += `spells_school like "%${this.searchSpellQuery.school}%" AND `;
    }
    if (this.searchSpellQuery.range != null && typeof this.searchSpellQuery.range !== 'undefined' && this.searchSpellQuery.range != "") {
      q += `spells_range like "%${this.searchSpellQuery.range}%" AND `;
    }
    if (this.searchSpellQuery.components != null && typeof this.searchSpellQuery.components !== 'undefined' && this.searchSpellQuery.components != "") {
      q += `spells_components like "%${this.searchSpellQuery.components}%" AND `;
    }
    if (this.searchSpellQuery.classes != null && typeof this.searchSpellQuery.classes !== 'undefined' && this.searchSpellQuery.classes != "") {
      q += `spells_classes like "%${this.searchSpellQuery.classes}%" AND `;
    }
    if (this.searchSpellQuery.text != null && typeof this.searchSpellQuery.text !== 'undefined' && this.searchSpellQuery.text != "") {
      q += `spells_text like "%${this.searchSpellQuery.text}%" AND `;
    }
    if (this.searchSpellQuery.sources != null && typeof this.searchSpellQuery.sources !== 'undefined' && this.searchSpellQuery.sources != "") {
      q += `spells_sources like "%${this.searchSpellQuery.sources}%" AND `;
    }
    if (this.searchSpellQuery.duration != null && typeof this.searchSpellQuery.duration !== 'undefined' && this.searchSpellQuery.duration != "") {
      q += `spells_duration like "%${this.searchSpellQuery.duration}%" AND `;
    }
    if (q.includes(" AND ")) {
      q = q.slice(0, -4);
    } else {
      q = q.slice(0, -6);
    }
  } else {
    q = q.slice(0, -6);
  }
  q += ` ORDER BY spells_name ASC LIMIT ${step} OFFSET ${start}`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getSearchSpellsResult', rows);
      console.log("====>" + `getSearchSpellsResult from ${start} to ${(start + step)} successfull`)
    });
  });
  return q;
}

let itemStep;
let itemStart;
const reciveItems = (step, start) => {
  itemStep = step;
  itemStart = start;
  let q = "SELECT * FROM 'main'.'tab_items' WHERE ";
  if (this.searchItemQuery != null) {
    if (this.searchItemQuery.name != null && typeof this.searchItemQuery.name !== 'undefined' && this.searchItemQuery.name != "") {
      q += `item_name like "%${this.searchItemQuery.name}%" AND `;
    }
    if (this.searchItemQuery.description != null && typeof this.searchItemQuery.description !== 'undefined' && this.searchItemQuery.description != "") {
      q += `item_description like "%${this.searchItemQuery.description}%" AND `;
    }
    if (this.searchItemQuery.rarity != null && typeof this.searchItemQuery.rarity !== 'undefined' && this.searchItemQuery.rarity != "") {
      q += `item_rarity like "%${this.searchItemQuery.rarity}%" AND `;
    }
    if (this.searchItemQuery.type != null && typeof this.searchItemQuery.type !== 'undefined' && this.searchItemQuery.type != "") {
      q += `item_type like "%${this.searchItemQuery.type}%" AND `;
    }
    if (q.includes(" AND ")) {
      q = q.slice(0, -4);
    } else {
      q = q.slice(0, -6);
    }
  } else {
    q = q.slice(0, -6);
  }
  q += ` ORDER BY item_name ASC LIMIT ${step} OFFSET ${start}`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getSearchItemsResult', rows);
      console.log("====>" + `getSearchItemsResult from ${start} to ${(start + step)} successfull`);
    });
  });
  return q;
}

let monsterStep;
let monsterStart;
const reciveMonsters = (step, start) => {
  monsterStep = step;
  monsterStart = start;
  let q = "SELECT * FROM 'main'.'tab_monsters' WHERE ";
  if (this.searchMonsterQuery != null) {
    if (this.searchMonsterQuery.name != null && typeof this.searchMonsterQuery.name !== 'undefined' && this.searchMonsterQuery.name != "") {
      q += `monster_name like "%${this.searchMonsterQuery.name}%" AND `;
    }
    if (this.searchMonsterQuery.type != null && typeof this.searchMonsterQuery.type !== 'undefined' && this.searchMonsterQuery.type != "") {
      q += `monster_type like "%${this.searchMonsterQuery.type}%" AND `;
    }
    if (this.searchMonsterQuery.subtype != null && typeof this.searchMonsterQuery.subtype !== 'undefined' && this.searchMonsterQuery.subtype != "") {
      q += `monster_subtype like "%${this.searchMonsterQuery.subtype}%" AND `;
    }
    if (this.searchMonsterQuery.cr != null && typeof this.searchMonsterQuery.cr !== 'undefined' && this.searchMonsterQuery.cr != "") {
      q += `monster_cr = "${this.searchMonsterQuery.cr}" AND `;
    }
    if (this.searchMonsterQuery.alignment != null && typeof this.searchMonsterQuery.alignment !== 'undefined' && this.searchMonsterQuery.alignment != "") {
      q += `monster_alignment like "%${this.searchMonsterQuery.alignment}%" AND `;
    }
    if (this.searchMonsterQuery.speed != null && typeof this.searchMonsterQuery.speed !== 'undefined' && this.searchMonsterQuery.speed != "") {
      q += `monster_speed like "%${this.searchMonsterQuery.speed}%" AND `;
    }
    if (this.searchMonsterQuery.senses != null && typeof this.searchMonsterQuery.senses !== 'undefined' && this.searchMonsterQuery.senses != "") {
      q += `monster_senses like "%${this.searchMonsterQuery.senses}%" AND `;
    }
    if (this.searchMonsterQuery.senses != null && typeof this.searchMonsterQuery.senses !== 'undefined' && this.searchMonsterQuery.senses != "") {
      q += `monster_senses like "%${this.searchMonsterQuery.senses}%" AND `;
    }
    if (this.searchMonsterQuery.ability != null && typeof this.searchMonsterQuery.ability !== 'undefined' && this.searchMonsterQuery.ability != "") {
      q += `monster_sAblt like "%${this.searchMonsterQuery.ability}%" AND `;
    }
    if (this.searchMonsterQuery.action != null && typeof this.searchMonsterQuery.action !== 'undefined' && this.searchMonsterQuery.action != "") {
      q += `(monster_ablt like "%${this.searchMonsterQuery.action}%" OR `;
      q += `monster_lAbtl like "%${this.searchMonsterQuery.action}%") AND `;
    }
    if (this.searchMonsterQuery.damage != null && typeof this.searchMonsterQuery.damage !== 'undefined' && this.searchMonsterQuery.damage != "") {
      q += `(monster_dmgVulnerabilities like "%${this.searchMonsterQuery.damage}%" OR `;
      q += `monster_dmgResistance like "%${this.searchMonsterQuery.damage}%" OR `;
      q += `monster_dmgImmunities like "%${this.searchMonsterQuery.damage}%") AND `;
    }
    if (q.includes(" AND ")) {
      q = q.slice(0, -4);
    } else {
      q = q.slice(0, -6);
    }
  } else {
    q = q.slice(0, -6);
  }
  q += ` ORDER BY monster_name ASC LIMIT ${step} OFFSET ${start}`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getSearchMonstersResult', rows);
      console.log("====>" + `getSearchMonstersResult from ${start} to ${(start + step)} successfull`)
    });
  });
  return q;
}

const reciveSpellCount = (q) => {
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getSpellCountResult', rows);
      console.log("====>" + `getSpellCount successfull`)
    });
  });
}

const reciveItemCount = (q) => {
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getItemCountResult', rows);
      console.log("====>" + `getItemCount successfull`)
    });
  });
}

const reciveMonsterCount = (q) => {
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getMonsterCountResult', rows);
      console.log("====>" + `getMonsterCount successfull`)
    });
  });
}

const reciveSpell = (id) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_spells' WHERE spells_id=?", [id], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getSpellResult', row);
      console.log("====>" + `getSpell successfull`)
    });
  });
}

const saveSpell = (spell) => {
  let data = [spell.name, spell.school, spell.level, spell.time, spell.duration, spell.range, spell.components, spell.text, spell.classes, spell.sources, spell.id];
  let sql = `UPDATE 'main'.'tab_spells'
              SET spells_name = ?, spells_school = ?, spells_level = ?, spells_time = ?, spells_duration = ?, spells_range = ?, spells_components = ?, spells_text = ?, spells_classes = ?, spells_sources = ?
              WHERE spells_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`${spell.name} updated successfull`);
      mainWindow.webContents.send('spellsUpdated', { spellStep, spellStart });
    });
  });
}

const saveItem = (item) => {
  let data = [item.name, item.type, item.rarity, item.description, item.pic, item.id];
  let sql = `UPDATE 'main'.'tab_items'
              SET item_name = ?, item_type = ?, item_rarity = ?, item_description = ?, item_pic = ?
              WHERE item_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`${item.name} updated successfull`);
      mainWindow.webContents.send('itemsUpdated', { itemStep, itemStart });
    });
  });
}

const deleteSpell = (spell) => {
  let data = [spell.id];
  let sql = `DELETE FROM 'main'.'tab_spells' WHERE spells_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Deleted ${spell.name} successfull`);
      spellWindow.hide();
      mainWindow.webContents.send('spellsUpdated', { spellStep, spellStart });
    });
  });
}

const deleteItem = (item) => {
  let data = [item.id];
  let sql = `DELETE FROM 'main'.'tab_items' WHERE item_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Deleted ${item.name} successfull`);
      spellWindow.hide();
      mainWindow.webContents.send('itemsUpdated', { itemStep, itemStart });
    });
  });
}

const saveNewSpell = (spell) => {
  let data = [spell.name, spell.school, spell.level, spell.time, spell.duration, spell.range, spell.components, spell.text, spell.classes, spell.sources];
  let sql = `INSERT INTO 'main'.'tab_spells' (spells_name, spells_school, spells_level, spells_time, spells_duration, spells_range, spells_components, spells_text, spells_classes, spells_sources)
              VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${spell.name} successfull`);
    });
  });
}

const saveNewSpells = (spells) => {
  spells.forEach(spell => {
    let data = [spell.spells_name, spell.spells_school, spell.spells_level, spell.spells_time, spell.spells_duration, spell.spells_range, spell.spells_components, spell.spells_text, spell.spells_classes, spell.spells_sources];
    let sql = `INSERT INTO 'main'.'tab_spells' (spells_name, spells_school, spells_level, spells_time, spells_duration, spells_range, spells_components, spells_text, spells_classes, spells_sources)
              VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${spell.spells_name} successfull`);
      });
    });
  });
}

const reciveChars = () => {
  db.serialize(function () {
    db.all("SELECT * FROM 'main'.'tab_characters' ORDER BY chars_player ASC", function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getCharsResult', rows);
      console.log("====>" + `getCharsResult successfull`)
    });
  });
}

ipcMain.on('getAllSpells', (event) => {
  reciveAllSpells();
});

ipcMain.on('getAllItems', (event) => {
  reciveAllItems();
});

ipcMain.on('getAllMonsters', (event) => {
  reciveAllMonsters();
});

ipcMain.on('getSearchSpells', (event, arg) => {
  const { step, start } = arg;
  this.searchSpellStep = step;
  reciveSpells(step, start);
});

ipcMain.on('getSearchItems', (event, arg) => {
  const { step, start } = arg;
  this.searchItemStep = step;
  reciveItems(step, start);
});

ipcMain.on('getSearchMonsters', (event, arg) => {
  const { step, start } = arg;
  this.searchMonsterStep = step;
  reciveMonsters(step, start);
});

ipcMain.on('getSpellCount', (event, arg) => {
  reciveSpellCount(`SELECT count(*) AS count FROM 'main'.'tab_spells'`);
});

ipcMain.on('getItemCount', (event, arg) => {
  reciveItemCount(`SELECT count(*) AS count FROM 'main'.'tab_items'`);
});

ipcMain.on('getMonsterCount', (event, arg) => {
  reciveMonsterCount(`SELECT count(*) AS count FROM 'main'.'tab_monsters'`);
});

ipcMain.on('sendSpellSearchQuery', (event, arg) => {
  const { query } = arg;
  this.searchSpellQuery = query;
  const q = reciveSpells(this.searchSpellStep, 0);
  reciveSpellCount(q.replace("SELECT * FROM 'main'.'tab_spells'", "SELECT count(*) AS count FROM 'main'.'tab_spells'"));
});

ipcMain.on('sendItemSearchQuery', (event, arg) => {
  const { query } = arg;
  this.searchItemQuery = query;
  const q = reciveItems(this.searchItemStep, 0);
  reciveItemCount(q.replace("SELECT * FROM 'main'.'tab_items'", "SELECT count(*) AS count FROM 'main'.'tab_items'"));
});

ipcMain.on('sendMonsterSearchQuery', (event, arg) => {
  const { query } = arg;
  this.searchMonsterQuery = query;
  const q = reciveMonsters(this.searchMonsterStep, 0);
  reciveMonsterCount(q.replace("SELECT * FROM 'main'.'tab_monsters'", "SELECT count(*) AS count FROM 'main'.'tab_monsters'"));
});

ipcMain.on('getSpell', (event, arg) => {
  const { id } = arg;
  reciveSpell(id);
});

ipcMain.on('saveSpell', (event, arg) => {
  const { spell } = arg;
  saveSpell(spell);
});

ipcMain.on('saveItem', (event, arg) => {
  const { item } = arg;
  saveItem(item);
});

ipcMain.on('deleteSpell', (event, arg) => {
  const { spell } = arg;
  deleteSpell(spell);
});

ipcMain.on('deleteItem', (event, arg) => {
  const { item } = arg;
  deleteItem(item);
});

ipcMain.on('saveNewSpell', (event, arg) => {
  const { spell } = arg;
  saveNewSpell(spell);
});

ipcMain.on('saveNewSpells', (event, arg) => {
  const { spells } = arg;
  saveNewSpells(spells);
});

ipcMain.on('getChars', (event, arg) => {
  reciveChars();
});

ipcMain.on('closeMainWindow', (event) => {
  mainWindow.close();
});

ipcMain.on('openSpellView', (event, spell) => {
  spellWindow.show();
  if (dev) {
    spellWindow.webContents.openDevTools();
  }
  spellWindow.setTitle("DnD Tome - " + spell.spells_name);
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