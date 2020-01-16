const path = window.require('path')
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;

let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

let classeStep;
let classeStart;
let searchClassQuery;

module.exports.reciveClass = (id, callback) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_classes' WHERE classe_id=?", [id], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(row);
      console.log("====>" + `getClass successfull`)
    });
  });
}

module.exports.reciveClassByName = (name, callback) => {
  db.serialize(function () {
    db.get("SELECT * FROM 'main'.'tab_classes' WHERE classe_name=?", [name], function (err, row) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(row);
      console.log("====>" + `getClass successfull`)
    });
  });
}

module.exports.reciveAllClasss = (callback) => {
  let q = "SELECT * FROM 'main'.'tab_classes' ORDER BY classe_name";
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log("====>" + `getAllClasssResult successfull`)
      callback(rows);
    });
  });
}

module.exports.reciveClassPerks = (id, callback) => {
  let q = `SELECT * FROM 'main'.'tab_classes_perks' WHERE classe_id=${id} ORDER BY perk_title`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      console.log("====>" + `getAllClasssPerksResult successfull`)
      callback(rows);
    });
  });
}

module.exports.reciveClasss = (step, start, query, callback) => {
  localStorage.setItem('classeStep', parseInt(step, 10));
  localStorage.setItem('classeStart', parseInt(start, 10));

  if (query !== null) {
    searchClassQuery = query;
  }
  let q = "SELECT * FROM 'main'.'tab_classes' WHERE ";
  if (searchClassQuery != null) {
    if (searchClassQuery.name != null && typeof searchClassQuery.name !== 'undefined' && searchClassQuery.name != "") {
      q += `classe_name like "%${searchClassQuery.name}%" AND `;
    }
    if (searchClassQuery.sources != null && typeof searchClassQuery.sources !== 'undefined' && searchClassQuery.sources != "") {
      q += `classe_sources like "%${searchClassQuery.sources}%" AND `;
    }
    if (searchClassQuery.abilityScoreImprov != null && typeof searchClassQuery.abilityScoreImprov !== 'undefined' && searchClassQuery.abilityScoreImprov != "") {
      q += `classe_abilityScoreImprov like "%${searchClassQuery.abilityScoreImprov}%" AND `;
    }
    if (searchClassQuery.size != null && typeof searchClassQuery.size !== 'undefined' && searchClassQuery.size != "") {
      q += `classe_size like "%${searchClassQuery.size}%" AND `;
    }
    if (searchClassQuery.speed != null && typeof searchClassQuery.speed !== 'undefined' && searchClassQuery.speed != "") {
      q += `classe_speed like "%${searchClassQuery.speed}%" AND `;
    }
    if (searchClassQuery.lang != null && typeof searchClassQuery.lang !== 'undefined' && searchClassQuery.lang != "") {
      q += `classe_lang like "%${searchClassQuery.lang}%" AND `;
    }
    if (q.includes(" AND ")) {
      q = q.slice(0, -4);
    } else {
      q = q.slice(0, -6);
    }
  } else {
    q = q.slice(0, -6);
  }
  q += ` ORDER BY classe_name ASC LIMIT ${step} OFFSET ${start}`;
  db.serialize(function () {
    db.all(q, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(rows);
      console.log("====>" + `getSearchClasssResult from ${start} to ${(start + step)} successfull`)
    });
  });
  return q;
}

module.exports.reciveClassCount = (query, callback) => {
  const q = this.reciveClasss(10, 0, query, function (result) { });
  const sql = q.replace("SELECT * FROM 'main'.'tab_classes'", "SELECT count(*) AS count FROM 'main'.'tab_classes'");
  db.serialize(function () {
    db.all(sql, function (err, rows) {
      if (err != null) {
        console.log("====>" + err);
      }
      callback(rows[0]);
      console.log("====>" + `getClassCount successfull`)
    });
  });
}

module.exports.reciveAttributeSelection = (attribute, callback) => {
  let q = `SELECT classe_${attribute} FROM 'main'.'tab_classes' GROUP BY classe_${attribute} ORDER BY classe_${attribute}`;
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
  let sql = `DELETE FROM 'main'.'tab_classes_perks' WHERE perk_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      callback();
      console.log(`====>Deleted ${classe.name} successfull`);
      ipcRenderer.send('displayMessage', { type: `Deleted perk`, message: `Deleted perk successful` });
    });
  });
}

module.exports.insertNewPerk = (id, callback) => {
  let data = ["", "", 1, id];
  let sql = `INSERT INTO 'main'.'tab_classes_perks'
               (perk_title, perk_text, perk_level, classe_id)
              VALUES (?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      callback(this.lastID);
      console.log(`====> add new perk successfull`);
      ipcRenderer.send('displayMessage', { type: `Added new classe perk`, message: `Added perk successful` });
    });
  });
}

module.exports.savePerks = (perks) => {
  perks.forEach(perk => {
    let data = [perk.perk_title, perk.perk_text, perk.perk_level, perk.perk_id];
    let sql = `UPDATE 'main'.'tab_classes_perks'
              SET perk_title = ?, perk_text = ?, perk_level = ?
              WHERE perk_id = ?`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====> perks updated successfull`);
        ipcRenderer.send('classesUpdated', { classeStep: parseInt(localStorage.getItem('classeStep'), 10), classeStart: parseInt(localStorage.getItem('classeStart'), 10) });
        ipcRenderer.send('displayMessage', { type: `Saved classe perks`, message: `Saved perks successful` });
      });
    });
  });
}

module.exports.saveClass = (classe) => {
  let data = [classe.name, classe.surces, classe.pic, classe.age, classe.abilityScoreImprov, classe.alignment, classe.size, classe.speed, classe.lang, classe.id];
  let sql = `UPDATE 'main'.'tab_classes'
              SET classe_name = ?, classe_sources = ?, classe_pic = ?, classe_age = ?, classe_abilityScoreImprov = ?, classe_alignment = ?, classe_size = ?, classe_speed = ?, classe_lang = ?
              WHERE classe_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====> ${classe.name} updated successfull`);
      ipcRenderer.send('classesUpdated', { classeStep: parseInt(localStorage.getItem('classeStep'), 10), classeStart: parseInt(localStorage.getItem('classeStart'), 10) });
      ipcRenderer.send('displayMessage', { type: `Saved classe`, message: `Saved ${classe.name} successful` });
    });
  });
}

module.exports.saveNewClass = (classe) => {
  let data = [classe.name, classe.surces, classe.pic, classe.age, classe.abilityScoreImprov, classe.alignment, classe.size, classe.speed, classe.lang];
  let sql = `INSERT INTO 'main'.'tab_classes' (classe_name, classe_sources, classe_pic, classe_age, classe_abilityScoreImprov, classe_alignment, classe_size, classe_speed, classe_lang)
              VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${classe.name} successfull`);
      ipcRenderer.send('displayMessage', { type: `Added classe`, message: `Added ${classe.name} successful` });
    });
  });
}

module.exports.saveNewClasss = (classes, callback) => {
  let classeImportLength = Object.keys(classes).length;
  let classeImported = 0;
  classes.forEach(classe => {
    let data = [classe.name, classe.surces, classe.pic, classe.age, classe.abilityScoreImprov, classe.alignment, classe.size, classe.speed, classe.lang];
    let sql = `INSERT INTO 'main'.'tab_classes' (classe_name, classe_sources, classe_pic, classe_age, classe_abilityScoreImprov, classe_alignment, classe_size, classe_speed, classe_lang)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
      db.run(sql, data, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`====>Added ${classe.classe_name} successfull`);
        classeImported++;
        callback({ now: classeImported, full: classeImportLength, name: classe.classe_name });
      });
    });
  });
}

module.exports.saveNewClassFromJson = (classeJson, callback) => {
  let classe = classeJson.classe;
  let data = [classe.classe_name, classe.classe_surces, classe.classe_pic, classe.classe_age, classe.classe_abilityScoreImprov, classe.classe_alignment, classe.classe_size, classe.classe_speed, classe.classe_lang];
  let sql = `INSERT INTO 'main'.'tab_classes' (classe_name, classe_sources, classe_pic, classe_age, classe_abilityScoreImprov, classe_alignment, classe_size, classe_speed, classe_lang)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${classe.classe_name} successfull`);
      callback({ id: this.lastID, perks: classeJson.perks });
    });
  });
}

module.exports.importClassPerks = (perks, id) => {
  perks.forEach(perk => {
    let data = [perk.perk_title, perk.perk_text, perk.perk_level, id];
    let sql = `INSERT INTO 'main'.'tab_classes_perks'
      (perk_title, perk_text, perk_level, classe_id)
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

module.exports.deleteClass = (classe) => {
  let data = [classe.id];
  let sql = `DELETE FROM 'main'.'tab_classes' WHERE classe_id = ?`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Deleted ${classe.name} successfull`);
      ipcRenderer.send('closeClassWindow');
      ipcRenderer.send('classesUpdated', { classeStep, classeStart });
      ipcRenderer.send('displayMessage', { type: `Deleted classe`, message: `Deleted ${classe.name} successful` });
    });
  });
}

module.exports.addClassToChar = (char, classe, callback) => {
  let data = [];
  if (classe.id === undefined) {
    data = [char.selectedChar, classe.classe_id, false];
  } else {
    data = [char.selectedChar, classe.id, false];
  }

  let sql = `INSERT INTO 'main'.'tab_characters_classes' (char_id, classe_id, classe_prepared)
              VALUES  (?, ?, ?)`;
  db.serialize(function () {
    db.run(sql, data, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`====>Added ${classe.name} to character successfull`);
      ipcRenderer.send('displayMessage', { type: `Added classe to character`, message: `Added ${classe.name} to character successful` });
      callback();
    });
  });
}
