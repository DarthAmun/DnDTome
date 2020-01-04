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
  let q = `SELECT race_${attribute} FROM 'main'.'tab_races' GROUP BY race_${attribute}`;
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


module.exports.saveRace = (race) => {
  let data = [race.name, race.school, race.level, race.ritual, race.time, race.duration, race.range, race.components, race.text, race.classes, race.sources, race.pic, race.id];
  let sql = `UPDATE 'main'.'tab_races'
              SET race_name = ?, race_school = ?, race_level = ?, race_ritual = ?, race_time = ?, race_duration = ?, race_range = ?, race_components = ?, race_text = ?, race_classes = ?, race_sources = ?, race_pic = ?
              WHERE race_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====> ${race.name} updated successfull`);
      ipcRenderer.send('racesUpdated', { raceStep: parseInt(localStorage.getItem('raceStep'), 10), raceStart: parseInt(localStorage.getItem('raceStart'), 10) });
      ipcRenderer.send('displayMessage', { type: `Saved race`, message: `Saved ${race.name} successful` });
    });
  });
}

module.exports.saveNewRace = (race) => {
  let data = [race.name, race.school, race.level, race.ritual, race.time, race.duration, race.range, race.components, race.text, race.classes, race.sources, race.pic];
  let sql = `INSERT INTO 'main'.'tab_races' (race_name, race_school, race_level, race_ritual, race_time, race_duration, race_range, race_components, race_text, race_classes, race_sources, race_pic)
              VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    let data = [race.race_name, race.race_ritual, race.race_school, race.race_level, race.race_time, race.race_duration, race.race_range, race.race_components, race.race_text, race.race_classes, race.race_sources, race.race_pic];
    let sql = `INSERT INTO 'main'.'tab_races' (race_name, race_ritual, race_school, race_level, race_time, race_duration, race_range, race_components, race_text, race_classes, race_sources, race_pic)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

module.exports.saveNewRaceFromJson = (race, callback) => {
  let data = [race.race_name, race.race_ritual, race.race_school, race.race_level, race.race_time, race.race_duration, race.race_range, race.race_components, race.race_text, race.race_classes, race.race_sources, race.race_pic];
  let sql = `INSERT INTO 'main'.'tab_races' (race_name, race_ritual, race_school, race_level, race_time, race_duration, race_range, race_components, race_text, race_classes, race_sources, race_pic)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${race.race_name} successfull`);
      callback(this.lastID);
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
      ipcRenderer.send('closeRaceWindow');
      ipcRenderer.send('racesUpdated', { raceStep, raceStart });
      ipcRenderer.send('displayMessage', { type: `Deleted monster`, message: `Deleted ${race.name} successful` });
    });
  });
}

module.exports.addRaceToChar = (char, race, callback) => {
  let data = [];
  if(race.id === undefined){
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
