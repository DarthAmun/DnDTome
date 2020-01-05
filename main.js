"use strict";

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// Keep a reference for dev mode
let dev = false;
if (
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true;
}

console.log("====>" + path.join(__dirname, "./src/assets/db/tab.db"));
let sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(path.join(__dirname, "./src/assets/db/tab.db"));

function createWindow() {
  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1185,
    height: 680,
    minHeight: 400,
    minWidth: 660,
    show: false,
    frame: false,
    icon: __dirname + "./src/assets/img/dice_icon.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(indexPath);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.setTitle("DnD Tome");
    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });
  mainWindow.on("closed", function() {
    db.close();
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const deleteAll = tab => {
  db.serialize(function() {
    db.run(`DELETE FROM tab_characters_${tab}`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_${tab} successful deleted`);
      mainWindow.webContents.send("displayMessage", { type: `Delete All ${tab}`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_${tab}'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_${tab} autoincreasement reseted successful`);
    });
    db.run(`DELETE FROM tab_${tab}`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from ${tab} successful deleted`);
      mainWindow.webContents.send("displayMessage", { type: `Delete All ${tab}`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_${tab}'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> ${tab} autoincreasement reseted successful`);
    });
  });
};

const deleteAllCharacters = () => {
  db.serialize(function() {
    db.run(`DELETE FROM tab_characters_spells`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_spells successful deleted`);
      mainWindow.webContents.send("displayMessage", {
        type: `Delete All character spells`,
        message: "delete all successful",
      });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_spells'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_spells autoincreasement reseted successful`);
    });

    db.run(`DELETE FROM tab_characters_items`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_items successful deleted`);
      mainWindow.webContents.send("displayMessage", {
        type: `Delete All character items`,
        message: "delete all successful",
      });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_items'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_sitems autoincreasement reseted successful`);
    });

    db.run(`DELETE FROM tab_characters_monsters`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters_monsters successful deleted`);
      mainWindow.webContents.send("displayMessage", {
        type: `Delete All character monsters`,
        message: "delete all successful",
      });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_monsters'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters_monsters autoincreasement reseted successful`);
    });

    db.run(`DELETE FROM tab_characters`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from characters successful deleted`);
      mainWindow.webContents.send("displayMessage", {
        type: `Delete All characters`,
        message: "delete all successful",
      });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> characters autoincreasement reseted successful`);
    });
  });
};

ipcMain.on("sendSpellSearchQuery", (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send("sendSpellSearchQuery", { query });
});
ipcMain.on("sendItemSearchQuery", (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send("sendItemSearchQuery", { query });
});
ipcMain.on("sendGearSearchQuery", (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send("sendGearSearchQuery", { query });
});
ipcMain.on("sendMonsterSearchQuery", (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send("sendMonsterSearchQuery", { query });
});
ipcMain.on("sendRaceSearchQuery", (event, arg) => {
  const { query } = arg;
  mainWindow.webContents.send("sendRaceSearchQuery", { query });
});

ipcMain.on("closeMainWindow", event => {
  mainWindow.close();
});

ipcMain.on("minimizeMainWindow", event => {
  mainWindow.minimize();
});

ipcMain.on("openView", (event, viewItem) => {
  mainWindow.webContents.send("onView", viewItem);
});

ipcMain.on("deleteAllSpells", event => {
  deleteAll("spells");
});
ipcMain.on("deleteAllItems", event => {
  deleteAll("items");
});
ipcMain.on("deleteAllGears", event => {
  deleteAll("gears");
});
ipcMain.on("deleteAllMonsters", event => {
  deleteAll("monsters");
});
ipcMain.on("deleteAllChars", event => {
  deleteAllCharacters();
});

ipcMain.on("spellsUpdated", (event, arg) => {
  const { spellStep, spellStart } = arg;
  mainWindow.webContents.send("spellsUpdated", { spellStep, spellStart });
});
ipcMain.on("itemsUpdated", (event, arg) => {
  const { itemStep, itemStart } = arg;
  mainWindow.webContents.send("itemsUpdated", { itemStep, itemStart });
});
ipcMain.on("gearsUpdated", (event, arg) => {
  const { gearStep, gearStart } = arg;
  mainWindow.webContents.send("gearsUpdated", { gearStep, gearStart });
});
ipcMain.on("monstersUpdated", (event, arg) => {
  const { monsterStep, monsterStart } = arg;
  mainWindow.webContents.send("monstersUpdated", { monsterStep, monsterStart });
});

ipcMain.on("displayMessage", (event, m) => {
  mainWindow.webContents.send("displayMessage", { type: m.type, message: m.message });
});
