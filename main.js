'use strict';

// Import parts of electron to use
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, './src/assets/db/tab_spells.db'));
console.log("====>" + path.join(__dirname, './src/assets/db/tab_spells.db'));

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 720,
    show: false,
    frame: false
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
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
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

let searchQuery = {};
let searchStep = 10;

const reciveSpells = (step, start) => {
  let q = "SELECT * FROM 'main'.'tab_spells' WHERE ";
  if (this.searchQuery != null) {
    if (this.searchQuery.name != null && typeof this.searchQuery.name !== 'undefined' && this.searchQuery.name != "") {
      q += `spells_name like "%${this.searchQuery.name}%" AND `;
    }
    if (this.searchQuery.time != null && typeof this.searchQuery.time !== 'undefined' && this.searchQuery.time != "") {
      q += `spells_time like "%${this.searchQuery.time}%" AND `;
    }
    if (this.searchQuery.level != null && typeof this.searchQuery.level !== 'undefined' && this.searchQuery.level != "") {
      q += `spells_level = "${this.searchQuery.level}" AND `;
    }
    if (this.searchQuery.school != null && typeof this.searchQuery.school !== 'undefined' && this.searchQuery.school != "") {
      q += `spells_school like "%${this.searchQuery.school}%" AND `;
    }
    if (this.searchQuery.range != null && typeof this.searchQuery.range !== 'undefined' && this.searchQuery.range != "") {
      q += `spells_range like "%${this.searchQuery.range}%" AND `;
    }
    if (this.searchQuery.component != null && typeof this.searchQuery.component !== 'undefined' && this.searchQuery.component != "") {
      q += `spells_components like "%${this.searchQuery.component}%" AND `;
    }
    if (this.searchQuery.class != null && typeof this.searchQuery.class !== 'undefined' && this.searchQuery.class != "") {
      q += `spells_classes like "%${this.searchQuery.class}%" AND `;
    }
    if (this.searchQuery.text != null && typeof this.searchQuery.text !== 'undefined' && this.searchQuery.text != "") {
      q += `spells_text like "%${this.searchQuery.text}%" AND `;
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

const reciveSpellCount = (q) => {
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
        callback(err);
      }
      mainWindow.webContents.send('getSpellCountResult', rows);
      console.log("====>" + `getSpellCount successfull`)
    });
  });
}

const reciveSpell = (id) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_spells' WHERE spells_id=?", [id], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
        callback(err);
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
      console.log(`Deleted ${spell.name} successfull`);
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
      console.log(`Added ${spell.name} successfull`);
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

const reciveItems = (step, start) => {
  db.serialize(function () {
    db.all(`SELECT * FROM 'main'.'tab_items' ORDER BY item_name ASC LIMIT ${step} OFFSET ${start}`, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getItemsResult', rows);
      console.log("====>" + `getItemsResult successfull`)
    });
  });
}

ipcMain.on('getSearchSpells', (event, arg) => {
  const { step, start } = arg;
  this.searchStep = step;
  reciveSpells(step, start);
});

ipcMain.on('getSpellCount', (event, arg) => {
  reciveSpellCount(`SELECT count(*) AS count FROM tab_spells`);
});

ipcMain.on('sendSearchQuery', (event, arg) => {
  const { query } = arg;
  this.searchQuery = query;
  const q = reciveSpells(this.searchStep, 0);
  reciveSpellCount(q.replace("SELECT * FROM tab_spells", "SELECT count(*) AS count FROM tab_spells"));
});

ipcMain.on('getSpell', (event, arg) => {
  const { id } = arg;
  reciveSpell(id);
});

ipcMain.on('saveSpell', (event, arg) => {
  const { spell } = arg;
  saveSpell(spell);
});

ipcMain.on('deleteSpell', (event, arg) => {
  const { spell } = arg;
  deleteSpell(spell);
});

ipcMain.on('saveNewSpell', (event, arg) => {
  const { spell } = arg;
  saveNewSpell(spell);
});

ipcMain.on('getChars', (event, arg) => {
  reciveChars();
});

ipcMain.on('getItems', (event, arg) => {
  const { step, start } = arg;
  reciveItems(step, start);
});

ipcMain.on('backSpell', (event) => {
  mainWindow.webContents.send('backSpell');
});
