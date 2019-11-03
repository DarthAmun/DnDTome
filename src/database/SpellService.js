const path = require('path')

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, '../assets/db/tab.db'));
let spellStep;
let spellStart;

module.exports.reciveSpell = (id, mainWindow) => {
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

module.exports.reciveAllSpells = (mainWindow) => {
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

module.exports.reciveSpells = (step, start, mainWindow) => {
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

module.exports.reciveSpellCount = (q, mainWindow) => {
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


module.exports.saveSpell = (spell, mainWindow) => {
  let data = [spell.name, spell.school, spell.level, spell.ritual, spell.time, spell.duration, spell.range, spell.components, spell.text, spell.classes, spell.sources, spell.id];
  let sql = `UPDATE 'main'.'tab_spells'
              SET spell_name = ?, spell_school = ?, spell_level = ?, spell_ritual = ?, spell_time = ?, spell_duration = ?, spell_range = ?, spell_components = ?, spell_text = ?, spell_classes = ?, spell_sources = ?
              WHERE spell_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====> ${spell.name} updated successfull`);
      mainWindow.webContents.send('spellsUpdated', { spellStep, spellStart });
      mainWindow.webContents.send('displayMessage', { type: `Saved spell`, message: `Saved ${spell.name} successful` });
    });
  });
}

module.exports.saveNewSpell = (spell, mainWindow) => {
  let data = [spell.name, spell.school, spell.level, spell.time, spell.duration, spell.range, spell.components, spell.text, spell.classes, spell.sources];
  let sql = `INSERT INTO 'main'.'tab_spells' (spell_name, spell_school, spell_level, spell_time, spell_duration, spell_range, spell_components, spell_text, spell_classes, spell_sources)
              VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${spell.name} successfull`);
      mainWindow.webContents.send('displayMessage', { type: `Added spell`, message: `Added ${spell.name} successful` });
    });
  });
}

module.exports.saveNewSpells = (spells, mainWindow) => {
  spells.forEach(spell => {
    let data = [spell.spell_name, spell.spell_ritual, spell.spell_school, spell.spell_level, spell.spell_time, spell.spell_duration, spell.spell_range, spell.spell_components, spell.spell_text, spell.spell_classes, spell.spell_sources];
    let sql = `INSERT INTO 'main'.'tab_spells' (spell_name, spell_ritual, spell_school, spell_level, spell_time, spell_duration, spell_range, spell_components, spell_text, spell_classes, spell_sources)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${spell.spell_name} successfull`);
        mainWindow.webContents.send('displayMessage', { type: `Added spell`, message: `Added ${spell.spell_name} successful` });
      });
    });
  });
}

module.exports.deleteSpell = (spell, mainWindow, spellWindow) => {
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
      mainWindow.webContents.send('displayMessage', { type: `Deleted monster`, message: `Deleted ${spell.name} successful` });
    });
  });
}

module.exports.addSpellToChar = (char, spell, mainWindow) => {
  let data = [char.selectedChar, spell.id, false];
  let sql = `INSERT INTO 'main'.'tab_characters_spells' (char_id, spell_id, spell_prepared)
              VALUES  (?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${spell.name} to character successfull`);
      mainWindow.webContents.send('displayMessage', { type: `Added spell to character`, message: `Added ${spell.name} to character successful` });
    });
  });
}
