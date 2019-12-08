const path = window.require('path')
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;

let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

let gearStep;
let gearStart;
let searchGearQuery;

module.exports.reciveAllGears = (callback) => {
    let q = "SELECT * FROM 'main'.'tab_gears'";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getAllGearsResult successfull`)
        });
    });
}

module.exports.reciveGears = (step, start, query, callback) => {
    localStorage.setItem('gearStep', parseInt(step, 10));
    localStorage.setItem('gearStart', parseInt(start, 10));

    if (query !== null) {
        searchGearQuery = query;
    }
    let q = "SELECT * FROM 'main'.'tab_gears' WHERE ";
    if (searchGearQuery != null) {
        if (searchGearQuery.name != null && typeof searchGearQuery.name !== 'undefined' && searchGearQuery.name != "") {
            q += `gear_name like "%${searchGearQuery.name}%" AND `;
        }
        if (searchGearQuery.type != null && typeof searchGearQuery.type !== 'undefined' && searchGearQuery.type != "") {
            q += `gear_type like "%${searchGearQuery.type}%" AND `;
        }
        if (searchGearQuery.description != null && typeof searchGearQuery.description !== 'undefined' && searchGearQuery.description != "") {
            q += `gear_description like "%${searchGearQuery.description}%" AND `;
        }
        if (searchGearQuery.cost != null && typeof searchGearQuery.cost !== 'undefined' && searchGearQuery.cost != "") {
            q += `gear_cost like "%${searchGearQuery.cost}%" AND `;
        }
        if (searchGearQuery.weight != null && typeof searchGearQuery.weight !== 'undefined' && searchGearQuery.weight != "") {
            q += `gear_weight like "%${searchGearQuery.weight}%" AND `;
        }
        if (searchGearQuery.damage != null && typeof searchGearQuery.damage !== 'undefined' && searchGearQuery.damage != "") {
            q += `gear_damage like "%${searchGearQuery.damage}%" AND `;
        }
        if (searchGearQuery.properties != null && typeof searchGearQuery.properties !== 'undefined' && searchGearQuery.properties != "") {
            q += `gear_properties like "%${searchGearQuery.properties}%" AND `;
        }
        if (q.includes(" AND ")) {
            q = q.slice(0, -4);
        } else {
            q = q.slice(0, -6);
        }
    } else {
        q = q.slice(0, -6);
    }
    q += ` ORDER BY gear_name ASC LIMIT ${step} OFFSET ${start}`;
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getSearchGearsResult from ${start} to ${(start + step)} successfull`);
        });
    });
    return q;
}

module.exports.reciveGearCount = (query, callback) => {
    const q = this.reciveGears(10, 0, query, function (result) { });
    const sql = q.replace("SELECT * FROM 'main'.'tab_gears'", "SELECT count(*) AS count FROM 'main'.'tab_gears'");
    db.serialize(function () {
        db.all(sql, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows[0]);
            console.log("====>" + `getGearCount successfull`)
        });
    });
}

module.exports.deleteGear = (gear) => {
    let data = [gear.id];
    let sql = `DELETE FROM 'main'.'tab_gears' WHERE gear_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${gear.name} successfull`);
            ipcRenderer.send('closeSpellWindow');
            ipcRenderer.send('gearsUpdated', { gearStep, gearStart });
            ipcRenderer.send('displayMessage', { type: `Deleted gear`, message: `Deleted ${gear.name} successful` });
        });
    });
}

module.exports.saveGear = (gear) => {
    let data = [gear.name, gear.description, gear.pic, gear.cost, gear.weight, gear.damage, gear.properties, gear.type, gear.id];
    let sql = `UPDATE 'main'.'tab_gears'
                SET gear_name = ?, gear_description = ?, gear_pic = ?, gear_cost= ?, gear_weight= ?, gear_damage= ?, gear_properties= ?, gear_type= ?
                WHERE gear_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${gear.name} updated successfull`);
            ipcRenderer.send('gearsUpdated', { gearStep: parseInt(localStorage.getItem('gearStep'), 10), gearStart: parseInt(localStorage.getItem('gearStart'), 10) });
            ipcRenderer.send('displayMessage', { type: `Saved gear`, message: `Saved ${gear.name} successful` });
        });
    });
}

module.exports.saveNewGear = (gear) => {
    let data = [gear.name, gear.description, gear.pic, gear.cost, gear.damage, gear.weight, gear.properties, gear.type];
    let sql = `INSERT INTO 'main'.'tab_gears' (gear_name, gear_description, gear_pic, gear_cost, gear_damage, gear_weight, gear_properties, gear_type)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${gear.name} successfull`);
            ipcRenderer.send('displayMessage', { type: `Added gear`, message: `Added ${gear.name} successful` });
        });
    });
}

module.exports.saveNewGears = (gears, callback) => {
    let GearImportLength = Object.keys(gears).length;
    let GearImported = 0;
    gears.forEach(gear => {
        let data = [gear.gear_name, gear.gear_description, gear.gear_pic, gear.gear_cost, gear.gear_damage, gear.gear_weight, gear.gear_properties, gear.gear_type];
        let sql = `INSERT INTO 'main'.'tab_gears' (gear_name, gear_description, gear_pic, gear_cost, gear_damage, gear_weight, gear_properties, gear_type)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====>Added ${gear.gear_name} successfull`);
                GearImported++;
                callback({ now: GearImported, full: GearImportLength, name: gear.gear_name });
            });
        });
    });
}

module.exports.addGearToChar = (char, gear) => {
    let data = [char.selectedChar, gear.id, 1, false, false, gear.damage, gear.properties];
    let sql = `INSERT INTO 'main'.'tab_characters_items' (char_id, gear_id, item_amount, item_equiped, item_attuned, item_damage, item_properties)
                VALUES  (?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${gear.name} to character successfull`);
            ipcRenderer.send('displayMessage', { type: `Added gear to character`, message: `Added ${gear.name} to character successful` });
        });
    });
}