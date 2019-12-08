const path = window.require('path')
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;

let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

let monsterStep;
let monsterStart;
let searchMonsterQuery;

module.exports.reciveAllMonsters = (callback) => {
    let q = "SELECT * FROM 'main'.'tab_monsters'";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getAllMonstersResult successfull`)
        });
    });
}

module.exports.reciveMonsters = (step, start, query, callback) => {
    localStorage.setItem('monsterStep', parseInt(step, 10));
    localStorage.setItem('monsterStart', parseInt(start, 10));
  
    if (query !== null) {
        searchMonsterQuery = query;
    }
    let q = "SELECT * FROM 'main'.'tab_monsters' WHERE ";
    if (searchMonsterQuery != null) {
        if (searchMonsterQuery.name != null && typeof searchMonsterQuery.name !== 'undefined' && searchMonsterQuery.name != "") {
            q += `monster_name like "%${searchMonsterQuery.name}%" AND `;
        }
        if (searchMonsterQuery.type != null && typeof searchMonsterQuery.type !== 'undefined' && searchMonsterQuery.type != "") {
            q += `monster_type like "%${searchMonsterQuery.type}%" AND `;
        }
        if (searchMonsterQuery.subtype != null && typeof searchMonsterQuery.subtype !== 'undefined' && searchMonsterQuery.subtype != "") {
            q += `monster_subtype like "%${searchMonsterQuery.subtype}%" AND `;
        }
        if (searchMonsterQuery.source != null && typeof searchMonsterQuery.source !== 'undefined' && searchMonsterQuery.source != "") {
            q += `monster_source like "%${searchMonsterQuery.source}%" AND `;
        }
        if (searchMonsterQuery.cr != null && typeof searchMonsterQuery.cr !== 'undefined' && searchMonsterQuery.cr != "") {
            q += `monster_cr = "${searchMonsterQuery.cr}" AND `;
        }
        if (searchMonsterQuery.alignment != null && typeof searchMonsterQuery.alignment !== 'undefined' && searchMonsterQuery.alignment != "") {
            q += `monster_alignment like "%${searchMonsterQuery.alignment}%" AND `;
        }
        if (searchMonsterQuery.speed != null && typeof searchMonsterQuery.speed !== 'undefined' && searchMonsterQuery.speed != "") {
            q += `monster_speed like "%${searchMonsterQuery.speed}%" AND `;
        }
        if (searchMonsterQuery.senses != null && typeof searchMonsterQuery.senses !== 'undefined' && searchMonsterQuery.senses != "") {
            q += `monster_senses like "%${searchMonsterQuery.senses}%" AND `;
        }
        if (searchMonsterQuery.senses != null && typeof searchMonsterQuery.senses !== 'undefined' && searchMonsterQuery.senses != "") {
            q += `monster_senses like "%${searchMonsterQuery.senses}%" AND `;
        }
        if (searchMonsterQuery.ability != null && typeof searchMonsterQuery.ability !== 'undefined' && searchMonsterQuery.ability != "") {
            q += `monster_sAblt like "%${searchMonsterQuery.ability}%" AND `;
        }
        if (searchMonsterQuery.action != null && typeof searchMonsterQuery.action !== 'undefined' && searchMonsterQuery.action != "") {
            q += `(monster_ablt like "%${searchMonsterQuery.action}%" OR `;
            q += `monster_lAbtl like "%${searchMonsterQuery.action}%") AND `;
        }
        if (searchMonsterQuery.damage != null && typeof searchMonsterQuery.damage !== 'undefined' && searchMonsterQuery.damage != "") {
            q += `(monster_dmgVulnerabilities like "%${searchMonsterQuery.damage}%" OR `;
            q += `monster_dmgResistance like "%${searchMonsterQuery.damage}%" OR `;
            q += `monster_dmgImmunities like "%${searchMonsterQuery.damage}%") AND `;
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
            callback(rows);
            console.log("====>" + `getSearchMonstersResult from ${start} to ${(start + step)} successfull`)
        });
    });
    return q;
}

module.exports.reciveMonsterCount = (q, mainWindow) => {
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

module.exports.saveMonster = (monster) => {
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
            console.log(`====> ${monster.name} updated successfull`);
            ipcRenderer.send('monstersUpdated', { monsterStep: parseInt(localStorage.getItem('monsterStep'), 10), monterStart: parseInt(localStorage.getItem('monterStart'), 10) });
            ipcRenderer.send('displayMessage', { type: `Saved monster`, message: `Saved ${monster.name} successful` });
        });
    });
}

module.exports.saveNewMonster = (monster, mainWindow) => {
    let data = [monster.name, monster.size, monster.type, monster.subtype, monster.alignment, monster.ac, monster.hp, monster.speed, monster.str,
    monster.dex, monster.con, monster.int, monster.wis, monster.cha, monster.saveingThrows, monster.skills, monster.dmgVulnerabilitie,
    monster.dmgResistance, monster.dmgImmunities, monster.monster_conImmunities, monster.senses, monster.lang, monster.cr, monster.sAblt, monster.ablt, monster.lAblt,
    monster.source, monster.pic];
    let sql = `INSERT INTO 'main'.'tab_monsters'
                (monster_name, monster_size, monster_type, monster_subtype, monster_alignment, monster_armorClass,
                monster_hitPoints, monster_speed, monster_strength, monster_dexterity, monster_constitution, 
                monster_intelligence, monster_wisdom, monster_charisma, monster_savingThrows, monster_skills, 
                monster_dmgVulnerabilities, monster_dmgResistance, monster_dmgImmunities, monster_conImmunities, monster_senses, monster_lang, 
                monster_cr, monster_sAblt, monster_ablt, monster_lAbtl, monster_source, monster_pic)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${monster.name} successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added monster`, message: `Added ${monster.name} successful` });
        });
    });
}

module.exports.saveNewMonsters = (monsters, callback) => {
    let monsterImportLength = Object.keys(monsters).length;
    let monsterImported = 0;
    monsters.forEach(monster => {
        let data = [monster.monster_name, monster.monster_size, monster.monster_type, monster.monster_subtype, monster.monster_alignment,
        monster.monster_armorClass, monster.monster_hitPoints, monster.monster_speed, monster.monster_strength, monster.monster_dexterity,
        monster.monster_constitution, monster.monster_intelligence, monster.monster_wisdom, monster.monster_charisma, monster.monster_savingThrows,
        monster.monster_skills, monster.monster_dmgVulnerabilities, monster.monster_dmgResistance, monster.monster_dmgImmunities, monster.monster_conImmunities,
        monster.monster_senses, monster.monster_lang, monster.monster_cr, monster.monster_sAblt, monster.monster_ablt, monster.monster_lAbtl,
        monster.monster_source, monster.monster_pic];
        let sql = `INSERT INTO 'main'.'tab_monsters'
                  (monster_name, monster_size, monster_type, monster_subtype, monster_alignment, monster_armorClass,
                  monster_hitPoints, monster_speed, monster_strength, monster_dexterity, monster_constitution, 
                  monster_intelligence, monster_wisdom, monster_charisma, monster_savingThrows, monster_skills, 
                  monster_dmgVulnerabilities, monster_dmgResistance, monster_dmgImmunities, monster_conImmunities, monster_senses, monster_lang, 
                  monster_cr, monster_sAblt, monster_ablt, monster_lAbtl, monster_source, monster_pic)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====>Added ${monster.monster_name} successfull`);
                monsterImported++;
                callback({ now: monsterImported, full: monsterImportLength, name: monster.monster_name });
            });
        });
    });
}

module.exports.deleteMonster = (monster) => {
    let data = [monster.id];
    let sql = `DELETE FROM 'main'.'tab_monsters' WHERE monster_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${monster.name} successfull`);
            ipcRenderer.send('closeMonsterWindow');
            ipcRenderer.send('monstersUpdated', { monsterStep, monsterStart });
            ipcRenderer.send('displayMessage', { type: `Deleted monster`, message: `Deleted ${monster.name} successful` });
        });
    });
}

module.exports.addMonsterToChar = (char, monster, mainWindow) => {
    let data = [char.selectedChar, monster.id];
    let sql = `INSERT INTO 'main'.'tab_characters_monsters' (char_id, monster_id)
                VALUES  (?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${monster.name} to character successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added monster to character`, message: `Added ${monster.name} to character successful` });
        });
    });
}