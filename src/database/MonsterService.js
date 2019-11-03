const path = require('path')

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, '../assets/db/tab.db'));
let monsterStep;
let monsterStart;

module.exports.reciveAllMonsters = (mainWindow) => {
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

module.exports.reciveMonsters = (step, start, mainWindow) => {
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

module.exports.saveMonster = (monster, mainWindow) => {
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
            mainWindow.webContents.send('monstersUpdated', { monsterStep, monsterStart });
            mainWindow.webContents.send('displayMessage', { type: `Saved monster`, message: `Saved ${monster.name} successful` });
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

module.exports.saveNewMonsters = (monsters, mainWindow) => {
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
                mainWindow.webContents.send('displayMessage', { type: `Added monster`, message: `Added ${monster.monster_name} successful` });
            });
        });
    });
}

module.exports.deleteMonster = (monster, mainWindow, monsterWindow) => {
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
            mainWindow.webContents.send('displayMessage', { type: `Deleted monster`, message: `Deleted ${monster.name} successful` });
        });
    });
}