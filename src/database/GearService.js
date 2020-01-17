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
    let q = "SELECT * FROM 'main'.'tab_gears' ORDER BY gear_name";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log("====>" + `getAllGearsResult successfull`)
            callback(rows);
        });
    });
}

module.exports.reciveGearByName = (name, callback) => {
    db.serialize(function () {
        db.get("SELECT * FROM 'main'.'tab_gears' WHERE gear_name=?", [name], function (err, row) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(row);
            console.log("====>" + `getSpell successfull`)
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
        if (searchGearQuery.type != null && typeof searchGearQuery.type !== 'undefined' && searchGearQuery.type != "" && searchGearQuery.type.length !== 0) {
            searchGearQuery.type.map(type => {
                q += `gear_type = "${type.value}" OR `;
            });
            q = q.slice(0, -3);
            q += "AND ";
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
        if (searchGearQuery.sources != null && typeof searchGearQuery.sources !== 'undefined' && searchGearQuery.sources != "") {
            q += `gear_sources like "%${searchGearQuery.sources}%" AND `;
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
            console.log("====>" + `getSearchGearsResult from ${start} to ${(start + step)} successfull`);
            callback(rows);
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
            console.log("====>" + `getGearCount successfull`)
            callback(rows[0]);
        });
    });
}

module.exports.reciveAttributeSelection = (attribute, callback) => {
    let q = `SELECT gear_${attribute} FROM 'main'.'tab_gears' GROUP BY gear_${attribute} ORDER BY gear_${attribute}`;
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

module.exports.saveGear = (gear) => {
    let data = [gear.name, gear.description, gear.pic, gear.cost, gear.weight, gear.damage, gear.properties, gear.type, gear.sources, gear.id];
    let sql = `UPDATE 'main'.'tab_gears'
                SET gear_name = ?, gear_description = ?, gear_pic = ?, gear_cost= ?, gear_weight= ?, gear_damage= ?, gear_properties= ?, gear_type= ?, gear_sources= ?
                WHERE gear_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${gear.name} updated successfull`);
            ipcRenderer.send('displayMessage', { type: `Saved gear`, message: `Saved ${gear.name} successful` });
        });
    });
}

module.exports.saveNewGear = (gear) => {
    let data = [gear.name, gear.description, gear.pic, gear.cost, gear.damage, gear.weight, gear.properties, gear.type, gear.sources];
    let sql = `INSERT INTO 'main'.'tab_gears' (gear_name, gear_description, gear_pic, gear_cost, gear_damage, gear_weight, gear_properties, gear_type, gear_sources)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        let data = [gear.gear_name, gear.gear_description, gear.gear_pic, gear.gear_cost, gear.gear_damage, gear.gear_weight, gear.gear_properties, gear.gear_type, gear.gear_sources];
        let sql = `INSERT INTO 'main'.'tab_gears' (gear_name, gear_description, gear_pic, gear_cost, gear_damage, gear_weight, gear_properties, gear_type, gear_sources)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

module.exports.saveNewGearFromJson = (gear, callback) => {
    let data = [gear.gear_name, gear.gear_description, gear.gear_pic, gear.gear_cost, gear.gear_damage, gear.gear_weight, gear.gear_properties, gear.gear_type, gear.gear_sources];
    let sql = `INSERT INTO 'main'.'tab_gears' (gear_name, gear_description, gear_pic, gear_cost, gear_damage, gear_weight, gear_properties, gear_type, gear_sources)
                VALUES  (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${gear.gear_name} successfull`);
            callback(this.lastID);
        });
    });
}

module.exports.addGearToChar = (char, gear, callback) => {
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
            callback();
        });
    });
}

module.exports.deleteGear = (gear) => {
    let data = [gear.id];
    let sql1 = `DELETE FROM 'main'.'tab_gears' WHERE gear_id = ?`;
    let sql2 = `DELETE FROM 'main'.'tab_characters_items' WHERE gear_id = ?`;
    db.serialize(function () {
        db.run(sql2, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${gear.name} from characters successfull`);
        });
        db.run(sql1, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${gear.name} successfull`);
            ipcRenderer.send('closeActiveView');
            ipcRenderer.send('removeWindow', gear);
            ipcRenderer.send('displayMessage', { type: `Deleted gear`, message: `Deleted ${gear.name} successful` });
        });
    });
}

module.exports.deleteAllGear = () => {
    db.serialize(function () {
        db.run(`DELETE FROM tab_characters_gears`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> All from characters_gears successful deleted`);
            ipcRenderer.send("displayMessage", { type: `Delete All gears`, message: "delete all gear from characters successful" });
        });
        db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_gears'`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> characters_gears autoincreasement reseted successful`);
        });
        db.run(`DELETE FROM tab_gears`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> All from gears successful deleted`);
            ipcRenderer.send("displayMessage", { type: `Delete all gears`, message: "delete all gears successful" });
        });
        db.run(`DELETE FROM sqlite_sequence WHERE name='tab_gears'`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> gears autoincreasement reseted successful`);
        });
    });
};

module.exports.addGearToCharFromJson = (char, gear, callback) => {
    let data = [];
    if (gear.id === undefined) {
        data = [char.selectedChar, gear.gear_id, 1, false, false, gear.gear_damage, gear.gear_properties];
    } else {
        data = [char.selectedChar, gear.id, 1, false, false, gear.gear_damage, gear.gear_properties];
    }
    let sql = `INSERT INTO 'main'.'tab_characters_items' (char_id, gear_id, item_amount, item_equiped, item_attuned, item_damage, item_properties)
                VALUES  (?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${gear.name} to character successfull`);
            ipcRenderer.send('displayMessage', { type: `Added gear to character`, message: `Added ${gear.name} to character successful` });
            callback();
        });
    });
}