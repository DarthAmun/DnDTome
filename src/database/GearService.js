const path = require('path')

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, '../assets/db/tab.db'));
let gearStep;
let gearStart;
let searchGearQuery;

module.exports.reciveAllGears = (mainWindow) => {
    let q = "SELECT * FROM 'main'.'tab_gears'";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getAllGearsResult', rows);
            console.log("====>" + `getAllGearsResult successfull`)
        });
    });
}

module.exports.reciveGears = (step, start, query, mainWindow) => {
    gearStep = step;
    gearStart = start;
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
            mainWindow.webContents.send('getSearchGearsResult', rows);
            console.log("====>" + `getSearchGearsResult from ${start} to ${(start + step)} successfull`);
        });
    });
    return q;
}

module.exports.reciveGearCount = (q, mainWindow) => {
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getGearCountResult', rows);
            console.log("====>" + `getGearCount successfull`)
        });
    });
}

module.exports.deleteGear = (gear, mainWindow, gearWindow) => {
    let data = [gear.id];
    let sql = `DELETE FROM 'main'.'tab_gears' WHERE gear_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${gear.name} successfull`);
            gearWindow.hide();
            mainWindow.webContents.send('gearsUpdated', { gearStep, gearStart });
            mainWindow.webContents.send('displayMessage', { type: `Deleted gear`, message: `Deleted ${gear.name} successful` });
        });
    });
}

module.exports.saveGear = (gear, mainWindow) => {
    console.log("save function");
    let data = [gear.name, gear.description, gear.pic, gear.cost, gear.weight, gear.damage, gear.properties, gear.gear_type, gear.id];
    let sql = `UPDATE 'main'.'tab_gears'
                SET gear_name = ?, gear_description = ?, gear_pic = ?, gear_cost= ?, gear_weight= ?, gear_damage= ?, gear_properties= ?, gear_type= ?
                WHERE gear_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${gear.name} updated successfull`);
            mainWindow.webContents.send('gearsUpdated', { gearStep, gearStart });
            mainWindow.webContents.send('displayMessage', { type: `Saved gear`, message: `Saved ${gear.name} successful` });
        });
    });
}

module.exports.saveNewGear = (gear, mainWindow) => {
    let data = [gear.name, gear.description, gear.pic, gear.rarity, gear.type, gear.source];
    let sql = `INSERT INTO 'main'.'tab_gears' (gear_name, gear_description, gear_pic, gear_rarity, gear_type, gear_source)
                VALUES  (?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${gear.name} successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added gear`, message: `Added ${gear.name} successful` });
        });
    });
}

module.exports.saveNewGears = (gears, mainWindow) => {
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
                mainWindow.webContents.send('displayMessage', { type: `Added gear`, message: `Added ${gear.gear_name} successful` });
            });
        });
    });
}

module.exports.addGearToChar = (char, gear, mainWindow) => {
    let data = [char.selectedChar, gear.id, 1, false, false, gear.damage, gear.properties];
    let sql = `INSERT INTO 'main'.'tab_characters_items' (char_id, gear_id, item_amount, item_equiped, item_attuned, item_damage, item_properties)
                VALUES  (?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${gear.name} to character successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added gear to character`, message: `Added ${gear.name} to character successful` });
        });
    });
}