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
    monsterWindow = null;
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
    height: 480,
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

  //Monster window
  monsterWindow = new BrowserWindow({
    parent: mainWindow,
    width: 915,
    height: 750,
    show: false,
    resizable: true,
    frame: true,
    icon: __dirname + './src/assets/img/dice_icon.ico'
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
const reciveAllMonsters = () => {
  let q = "SELECT * FROM 'main'.'tab_monsters'";
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getAllMonstersResult', rows);
      console.log("====>" + `getAllMonstersResult successfull`)
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
      q += `spell_name like "%${this.searchSpellQuery.name}%" AND `;
    }
    if (this.searchSpellQuery.time != null && typeof this.searchSpellQuery.time !== 'undefined' && this.searchSpellQuery.time != "") {
      q += `spell_time like "%${this.searchSpellQuery.time}%" AND `;
    }
    if (this.searchSpellQuery.level != null && typeof this.searchSpellQuery.level !== 'undefined' && this.searchSpellQuery.level != "") {
      q += `spell_level = "${this.searchSpellQuery.level}" AND `;
    }
    if (this.searchSpellQuery.school != null && typeof this.searchSpellQuery.school !== 'undefined' && this.searchSpellQuery.school != "") {
      q += `spell_school like "%${this.searchSpellQuery.school}%" AND `;
    }
    if (this.searchSpellQuery.range != null && typeof this.searchSpellQuery.range !== 'undefined' && this.searchSpellQuery.range != "") {
      q += `spell_range like "%${this.searchSpellQuery.range}%" AND `;
    }
    if (this.searchSpellQuery.components != null && typeof this.searchSpellQuery.components !== 'undefined' && this.searchSpellQuery.components != "") {
      q += `spell_components like "%${this.searchSpellQuery.components}%" AND `;
    }
    if (this.searchSpellQuery.classes != null && typeof this.searchSpellQuery.classes !== 'undefined' && this.searchSpellQuery.classes != "") {
      q += `spell_classes like "%${this.searchSpellQuery.classes}%" AND `;
    }
    if (this.searchSpellQuery.text != null && typeof this.searchSpellQuery.text !== 'undefined' && this.searchSpellQuery.text != "") {
      q += `spell_text like "%${this.searchSpellQuery.text}%" AND `;
    }
    if (this.searchSpellQuery.sources != null && typeof this.searchSpellQuery.sources !== 'undefined' && this.searchSpellQuery.sources != "") {
      q += `spell_sources like "%${this.searchSpellQuery.sources}%" AND `;
    }
    if (this.searchSpellQuery.duration != null && typeof this.searchSpellQuery.duration !== 'undefined' && this.searchSpellQuery.duration != "") {
      q += `spell_duration like "%${this.searchSpellQuery.duration}%" AND `;
    }
    if (q.includes(" AND ")) {
      q = q.slice(0, -4);
    } else {
      q = q.slice(0, -6);
    }
  } else {
    q = q.slice(0, -6);
  }
  q += ` ORDER BY spell_name ASC LIMIT ${step} OFFSET ${start}`;
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
    if (this.searchItemQuery.source != null && typeof this.searchItemQuery.source !== 'undefined' && this.searchItemQuery.source != "") {
      q += `item_source like "%${this.searchItemQuery.source}%" AND `;
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
    db.get("SELECT * FROM 'main'.'tab_spells' WHERE spell_id=?", [id], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getSpellResult', row);
      console.log("====>" + `getSpell successfull`)
    });
  });
}

const reciveChar = (id) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_characters' WHERE char_id=?", [id], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getCharResult', row);
      console.log("====>" + `getCharResult successfull`)
    });
  });
}

const reciveCharSpells = (id) => {
  db.serialize(function () {
    db.all("SELECT * FROM 'main'.'tab_characters_spells' AS a LEFT JOIN 'main'.'tab_spells' AS b ON a.spell_id = b.spell_id WHERE char_id=? ORDER BY b.spell_level, b.spell_name", [id], function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      mainWindow.webContents.send('getCharSpellsResult', rows);
      console.log("====>" + `getCharSpellsResult successfull`)
    });
  });
}

const saveSpell = (spell) => {
  let data = [spell.name, spell.school, spell.level, spell.time, spell.duration, spell.range, spell.components, spell.text, spell.classes, spell.sources, spell.id];
  let sql = `UPDATE 'main'.'tab_spells'
              SET spell_name = ?, spell_school = ?, spell_level = ?, spell_time = ?, spell_duration = ?, spell_range = ?, spell_components = ?, spell_text = ?, spell_classes = ?, spell_sources = ?
              WHERE spell_id = ?`;
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
  let data = [item.name, item.type, item.rarity, item.description, item.pic, item.source, item.id];
  let sql = `UPDATE 'main'.'tab_items'
              SET item_name = ?, item_type = ?, item_rarity = ?, item_description = ?, item_pic = ?, item_source = ?
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

const saveMonster = (monster) => {
  let data = [monster.name, monster.size, monster.type, monster.subtype, monster.alignment, monster.ac, monster.hp, monster.speed, monster.str, 
    monster.dex, monster.con, monster.int, monster.wis, monster.cha, monster.saveingThrows, monster.skills, monster.dmgVulnerabilitie, 
    monster.dmgResistance, monster.dmgImmunities, monster.senses, monster.lang, monster.cr, monster.sAblt, monster.ablt, monster.lAblt, 
    monster.source, monster.pic, monster.id];
  let sql = `UPDATE 'main'.'tab_monsters'
              SET monster_name = ?, monster_size = ?, monster_type = ?, monster_subtype = ?, monster_alignment = ?, monster_armorClass = ?,
              monster_hitPoints = ?, monster_speed = ?, monster_strength = ?, monster_dexterity = ?, monster_constitution = ?, 
              monster_intelligence = ?, monster_wisdom = ?, monster_charisma = ?, monster_savingThrows = ?, monster_skills = ?, 
              monster_dmgVulnerabilities = ?, monster_dmgResistance = ?, monster_dmgImmunities = ?, monster_senses = ?, monster_lang = ?, 
              monster_cr = ?, monster_sAblt = ?, monster_ablt = ?, monster_lAbtl = ?, monster_source = ?, monster_pic = ?
              WHERE monster_id = ?`; 
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`${monster.name} updated successfull`);
      mainWindow.webContents.send('monstersUpdated', { monsterStep, monsterStart });
    });
  });
}

const saveChar = (char) => {
  let data = [char.name, char.player, char.prof, char.exp, char.pic, char.class, char.race, char.background, char.ac, char.hp, char.currentHp, 
    char.init, char.str, char.dex, char.con, char.int, char.wis, char.cha, char.actions, char.features, char.profsLangs, char.notes, char.id];
  let sql = `UPDATE 'main'.'tab_characters'
              SET char_name = ?, char_player = ?, char_prof = ?, char_exp = ?, char_pic = ?, char_class = ?, char_race = ?, char_background = ?, 
              char_ac = ?, char_hp = ?, char_hp_current = ?, char_init = ?, char_str = ?, char_dex = ?, char_con = ?, char_int = ?, char_wis = ?, 
              char_cha = ?, char_actions = ?, char_features = ?, char_profs_langs = ?, char_notes = ?
              WHERE char_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`${char.name} updated successfull`);
    });
  });
}

const deleteSpell = (spell) => {
  let data = [spell.id];
  let sql = `DELETE FROM 'main'.'tab_spells' WHERE spell_id = ?`;
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
      itemWindow.hide();
      mainWindow.webContents.send('itemsUpdated', { itemStep, itemStart });
    });
  });
}

const deleteMonster = (monster) => {
  let data = [monster.id];
  let sql = `DELETE FROM 'main'.'tab_monsters' WHERE monster_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Deleted ${monster.name} successfull`);
      monsterWindow.hide();
      mainWindow.webContents.send('monstersUpdated', { monsterStep, monsterStart });
    });
  });
}

const saveNewSpell = (spell) => {
  let data = [spell.name, spell.school, spell.level, spell.time, spell.duration, spell.range, spell.components, spell.text, spell.classes, spell.sources];
  let sql = `INSERT INTO 'main'.'tab_spells' (spell_name, spell_school, spell_level, spell_time, spell_duration, spell_range, spell_components, spell_text, spell_classes, spell_sources)
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
    let data = [spell.spell_name, spell.spell_school, spell.spell_level, spell.spell_time, spell.spell_duration, spell.spell_range, spell.spell_components, spell.spell_text, spell.spell_classes, spell.spell_sources];
    let sql = `INSERT INTO 'main'.'tab_spells' (spell_name, spell_school, spell_level, spell_time, spell_duration, spell_range, spell_components, spell_text, spell_classes, spell_sources)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${spell.spell_name} successfull`);
      });
    });
  });
}

const saveNewItem = (item) => {
  let data = [item.name, item.description, item.pic, item.rarity, item.type, item.source];
  let sql = `INSERT INTO 'main'.'tab_items' (item_name, item_description, item_pic, item_rarity, item_type, item_source)
              VALUES  (?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${item.name} successfull`);
    });
  });
}
const saveNewItems = (items) => {
  console.log(items);
  items.forEach(item => {
    let data = [item.item_name, item.item_description, item.item_pic, item.item_rarity, item.item_type, item.item_source];
    let sql = `INSERT INTO 'main'.'tab_items' (item_name, item_description, item_pic, item_rarity, item_type, item_source)
              VALUES  (?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${item.item_name} successfull`);
      });
    });
  });
}

const saveNewMonster = (monster) => {
  let data = [monster.name, monster.size, monster.type, monster.subtype, monster.alignment, monster.ac, monster.hp, monster.speed, monster.str, 
    monster.dex, monster.con, monster.int, monster.wis, monster.cha, monster.saveingThrows, monster.skills, monster.dmgVulnerabilitie, 
    monster.dmgResistance, monster.dmgImmunities, monster.senses, monster.lang, monster.cr, monster.sAblt, monster.ablt, monster.lAblt, 
    monster.source, monster.pic];
  let sql = `INSERT INTO 'main'.'tab_monsters'
              (monster_name, monster_size, monster_type, monster_subtype, monster_alignment, monster_armorClass,
              monster_hitPoints, monster_speed, monster_strength, monster_dexterity, monster_constitution, 
              monster_intelligence, monster_wisdom, monster_charisma, monster_savingThrows, monster_skills, 
              monster_dmgVulnerabilities, monster_dmgResistance, monster_dmgImmunities, monster_senses, monster_lang, 
              monster_cr, monster_sAblt, monster_ablt, monster_lAbtl, monster_source, monster_pic)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`; 
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${monster.name} successfull`);
    });
  });
}
const saveNewMonsters = (monsters) => {
  console.log(monsters);
  monsters.forEach(monster => {
    let data = [monster.monster_name, monster.monster_size, monster.monster_type, monster.monster_subtype, monster.monster_alignment, 
      monster.monster_armorClass, monster.monster_hitPoints, monster.monster_speed, monster.monster_strength, monster.monster_dexterity, 
      monster.monster_constitution, monster.monster_intelligence, monster.monster_wisdom, monster.monster_charisma, monster.monster_savingThrows, 
      monster.monster_skills, monster.monster_dmgVulnerabilities, monster.monster_dmgResistance, monster.monster_dmgImmunities, 
      monster.monster_senses, monster.monster_lang, monster.monster_cr, monster.monster_sAblt, monster.monster_ablt, monster.monster_lAbtl, 
      monster.monster_source, monster.monster_pic];
    let sql = `INSERT INTO 'main'.'tab_monsters'
                (monster_name, monster_size, monster_type, monster_subtype, monster_alignment, monster_armorClass,
                monster_hitPoints, monster_speed, monster_strength, monster_dexterity, monster_constitution, 
                monster_intelligence, monster_wisdom, monster_charisma, monster_savingThrows, monster_skills, 
                monster_dmgVulnerabilities, monster_dmgResistance, monster_dmgImmunities, monster_senses, monster_lang, 
                monster_cr, monster_sAblt, monster_ablt, monster_lAbtl, monster_source, monster_pic)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`; 
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${monster.monster_name} successfull`);
      });
    });
  });
}

const reciveChars = () => {
  db.serialize(function () {
    db.all("SELECT * FROM 'main'.'tab_characters' ORDER BY char_player ASC", function (err, rows) {
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

ipcMain.on('saveMonster', (event, arg) => {
  const { monster } = arg;
  saveMonster(monster);
});

ipcMain.on('saveChar', (event, arg) => {
  const { char } = arg;
  saveChar(char);
});

ipcMain.on('deleteSpell', (event, arg) => {
  const { spell } = arg;
  deleteSpell(spell);
});

ipcMain.on('deleteItem', (event, arg) => {
  const { item } = arg;
  deleteItem(item);
});

ipcMain.on('deleteMonster', (event, arg) => {
  const { monster } = arg;
  deleteMonster(monster);
});

ipcMain.on('saveNewSpell', (event, arg) => {
  const { spell } = arg;
  saveNewSpell(spell);
});
ipcMain.on('saveNewSpells', (event, arg) => {
  const { spells } = arg;
  saveNewSpells(spells);
});

ipcMain.on('saveNewItem', (event, arg) => {
  const { item } = arg;
  saveNewItem(item);
});
ipcMain.on('saveNewItems', (event, arg) => {
  const { items } = arg;
  saveNewItems(items);
});

ipcMain.on('saveNewMonster', (event, arg) => {
  const { monster } = arg;
  saveNewMonster(monster);
});
ipcMain.on('saveNewMonsters', (event, arg) => {
  const { monsters } = arg;
  saveNewMonsters(monsters);
});

ipcMain.on('getChars', (event, arg) => {
  reciveChars();
});

ipcMain.on('getChar', (event, arg) => {
  const { id } = arg;
  reciveChar(id);
});

ipcMain.on('getCharSpells', (event, arg) => {
  const { id } = arg;
  reciveCharSpells(id);
});

ipcMain.on('closeMainWindow', (event) => {
  mainWindow.close();
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

ipcMain.on('openMonsterView', (event, monster) => {
  monsterWindow.show();
  if (dev) {
    monsterWindow.webContents.openDevTools();
  }
  monsterWindow.setTitle("DnD Tome - " + monster.monster_name);
  monsterWindow.webContents.send('onViewMonster', monster);
});