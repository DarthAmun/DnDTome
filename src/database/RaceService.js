const path = window.require('path')
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;

let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

let raceStep;
let raceStart;
let searchRaceQuery;

module.exports.reciveRace = (id, callback) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_races' WHERE race_id=?", [id], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(row);
      console.log("====>" + `getRace successfull`)
    });
  });
}

module.exports.reciveRaceByName = (name, callback) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_races' WHERE race_name=?", [name], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(row);
      console.log("====>" + `getRace successfull`)
    });
  });
}

module.exports.reciveAllRaces = (callback) => {
  let q = "SELECT * FROM 'main'.'tab_races' ORDER BY race_name";
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log("====>" + `getAllRacesResult successfull`)
      callback(rows);
    });
  });
}

module.exports.reciveRacePerks = (id, callback) => {
  let q = `SELECT * FROM 'main'.'tab_races_perks' WHERE race_id=${id} ORDER BY perk_title`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log("====>" + `getAllRacesPerksResult successfull`)
      callback(rows);
    });
  });
}

module.exports.reciveRaces = (step, start, query, callback) => {
  localStorage.setItem('raceStep', parseInt(step, 10));
  localStorage.setItem('raceStart', parseInt(start, 10));

  if (query !== null) {
    searchRaceQuery = query;
  }
  let q = "SELECT * FROM 'main'.'tab_races' WHERE ";
  if (searchRaceQuery != null) {
    if (searchRaceQuery.name != null && typeof searchRaceQuery.name !== 'undefined' && searchRaceQuery.name != "") {
      q += `race_name like "%${searchRaceQuery.name}%" AND `;
    }
    if (searchRaceQuery.sources != null && typeof searchRaceQuery.sources !== 'undefined' && searchRaceQuery.sources != "") {
      q += `race_sources like "%${searchRaceQuery.sources}%" AND `;
    }
    if (searchRaceQuery.abilityScoreImprov != null && typeof searchRaceQuery.abilityScoreImprov !== 'undefined' && searchRaceQuery.abilityScoreImprov != "") {
      q += `race_abilityScoreImprov like "%${searchRaceQuery.abilityScoreImprov}%" AND `;
    }
    if (searchRaceQuery.size != null && typeof searchRaceQuery.size !== 'undefined' && searchRaceQuery.size != "") {
      q += `race_size like "%${searchRaceQuery.size}%" AND `;
    }
    if (searchRaceQuery.speed != null && typeof searchRaceQuery.speed !== 'undefined' && searchRaceQuery.speed != "") {
      q += `race_speed like "%${searchRaceQuery.speed}%" AND `;
    }
    if (searchRaceQuery.lang != null && typeof searchRaceQuery.lang !== 'undefined' && searchRaceQuery.lang != "") {
      q += `race_lang like "%${searchRaceQuery.lang}%" AND `;
    }
    if (q.includes(" AND ")) {
      q = q.slice(0, -4);
    } else {
      q = q.slice(0, -6);
    }
  } else {
    q = q.slice(0, -6);
  }
  q += ` ORDER BY race_name ASC LIMIT ${step} OFFSET ${start}`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(rows);
      console.log("====>" + `getSearchRacesResult from ${start} to ${(start + step)} successfull`)
    });
  });
  return q;
}

module.exports.reciveRaceCount = (query, callback) => {
  const q = this.reciveRaces(10, 0, query, function (result) { });
  const sql = q.replace("SELECT * FROM 'main'.'tab_races'", "SELECT count(*) AS count FROM 'main'.'tab_races'");
  db.serialize(function () {
    db.all(sql, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(rows[0]);
      console.log("====>" + `getRaceCount successfull`)
    });
  });
}

module.exports.reciveAttributeSelection = (attribute, callback) => {
  let q = `SELECT race_${attribute} FROM 'main'.'tab_races' GROUP BY race_${attribute} ORDER BY race_${attribute}`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(rows);
      console.log("====>" + `get all ${attribute} successfull`)
    });
  });
}

module.exports.deletePerk = (id, callback) => {
  let data = [id];
  let sql = `DELETE FROM 'main'.'tab_races_perks' WHERE perk_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      callback();
      console.log(`====>Deleted perk successfull`);
      ipcRenderer.send('displayMessage', { type: `Deleted perk`, message: `Deleted perk successful` });
    });
  });
}

module.exports.deletePerks = (race, callback) => {
  let data = [race.id];
  let sql = `DELETE FROM 'main'.'tab_races_perks' WHERE race_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      callback();
      console.log(`====>Deleted ${race.name} successfull`);
      ipcRenderer.send('displayMessage', { type: `Deleted perk`, message: `Deleted perk successful` });
    });
  });
}

module.exports.insertNewPerk = (id, callback) => {
  let data = ["", "", 1, id];
  let sql = `INSERT INTO 'main'.'tab_races_perks'
               (perk_title, perk_text, perk_level, race_id)
              VALUES (?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      callback(this.lastID);
      console.log(`====> add new perk successfull`);
      ipcRenderer.send('displayMessage', { type: `Added new race perk`, message: `Added perk successful` });
    });
  });
}

module.exports.savePerks = (perks) => {
  perks.forEach(perk => {
    let data = [perk.perk_title, perk.perk_text, perk.perk_level, perk.perk_id];
    let sql = `UPDATE 'main'.'tab_races_perks'
              SET perk_title = ?, perk_text = ?, perk_level = ?
              WHERE perk_id = ?`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====> perks updated successfull`);
        ipcRenderer.send('displayMessage', { type: `Saved race perks`, message: `Saved perks successful` });
      });
    });
  });
}

module.exports.saveRace = (race) => {
  let data = [race.name, race.surces, race.pic, race.age, race.abilityScoreImprov, race.alignment, race.size, race.speed, race.lang, race.id];
  let sql = `UPDATE 'main'.'tab_races'
              SET race_name = ?, race_sources = ?, race_pic = ?, race_age = ?, race_abilityScoreImprov = ?, race_alignment = ?, race_size = ?, race_speed = ?, race_lang = ?
              WHERE race_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====> ${race.name} updated successfull`);
      ipcRenderer.send('displayMessage', { type: `Saved race`, message: `Saved ${race.name} successful` });
    });
  });
}

module.exports.saveNewRace = (race) => {
  let data = [race.name, race.surces, race.pic, race.age, race.abilityScoreImprov, race.alignment, race.size, race.speed, race.lang];
  let sql = `INSERT INTO 'main'.'tab_races' (race_name, race_sources, race_pic, race_age, race_abilityScoreImprov, race_alignment, race_size, race_speed, race_lang)
              VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${race.name} successfull`);
      ipcRenderer.send('displayMessage', { type: `Added race`, message: `Added ${race.name} successful` });
    });
  });
}

module.exports.saveNewRaces = (races, callback) => {
  let raceImportLength = Object.keys(races).length;
  let raceImported = 0;
  races.forEach(race => {
    let data = [race.name, race.surces, race.pic, race.age, race.abilityScoreImprov, race.alignment, race.size, race.speed, race.lang];
    let sql = `INSERT INTO 'main'.'tab_races' (race_name, race_sources, race_pic, race_age, race_abilityScoreImprov, race_alignment, race_size, race_speed, race_lang)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${race.race_name} successfull`);
        raceImported++;
        callback({ now: raceImported, full: raceImportLength, name: race.race_name });
      });
    });
  });
}

module.exports.saveNewRaceFromJson = (raceJson, callback) => {
  let race = raceJson.race;
  let data = [race.race_name, race.race_surces, race.race_pic, race.race_age, race.race_abilityScoreImprov, race.race_alignment, race.race_size, race.race_speed, race.race_lang];
  let sql = `INSERT INTO 'main'.'tab_races' (race_name, race_sources, race_pic, race_age, race_abilityScoreImprov, race_alignment, race_size, race_speed, race_lang)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${race.race_name} successfull`);
      callback({ id: this.lastID, perks: raceJson.perks });
    });
  });
}

module.exports.importRacePerks = (perks, id) => {
  perks.forEach(perk => {
    let data = [perk.perk_title, perk.perk_text, perk.perk_level, id];
    let sql = `INSERT INTO 'main'.'tab_races_perks'
      (perk_title, perk_text, perk_level, race_id)
      VALUES (?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${perk.perk_name} successfull`);
      });
    });
  });
}

module.exports.deleteRace = (race) => {
  let data = [race.id];
  let sql = `DELETE FROM 'main'.'tab_races' WHERE race_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Deleted ${race.name} successfull`);
      ipcRenderer.send('closeActiveView');
      ipcRenderer.send('removeWindow', race);
      ipcRenderer.send('displayMessage', { type: `Deleted race`, message: `Deleted ${race.name} successful` });
    });
  });
}

module.exports.deleteAllRaces = () => {
  db.serialize(function() {
    db.run(`DELETE FROM tab_races`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from races successful deleted`);
      ipcRenderer.send("displayMessage", { type: `Delete All races`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_races'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> races autoincreasement reseted successful`);
    });
    db.run(`DELETE FROM tab_races_perks`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> All from races successful deleted`);
      ipcRenderer.send("displayMessage", { type: `Delete All races_perks`, message: "delete all successful" });
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='tab_races_perks'`, function(err) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log(`====> races_perks autoincreasement reseted successful`);
    });
  });
};

module.exports.addRaceToChar = (char, race, callback) => {
  let data = [];
  if (race.id === undefined) {
    data = [char.selectedChar, race.race_id, false];
  } else {
    data = [char.selectedChar, race.id, false];
  }

  let sql = `INSERT INTO 'main'.'tab_characters_races' (char_id, race_id, race_prepared)
              VALUES  (?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${race.name} to character successfull`);
      ipcRenderer.send('displayMessage', { type: `Added race to character`, message: `Added ${race.name} to character successful` });
      callback();
    });
  });
}
