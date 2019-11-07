const path = require('path')

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, '../assets/db/tab.db'));
let mitemStep;
let mitemStart;
let searchMitemQuery;

module.exports.reciveAllMitems = (mainWindow) => {
    let q = "SELECT * FROM 'main'.'tab_mitems'";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getAllMitemsResult', rows);
            console.log("====>" + `getAllMitemsResult successfull`)
        });
    });
}

module.exports.reciveMitems = (step, start, query, mainWindow) => {
    mitemStep = step;
    mitemStart = start;
    searchMitemQuery = query;
    let q = "SELECT * FROM 'main'.'tab_mitems' WHERE ";
    if (searchMitemQuery != null) {
        if (searchMitemQuery.name != null && typeof searchMitemQuery.name !== 'undefined' && searchMitemQuery.name != "") {
            q += `mitem_name like "%${searchMitemQuery.name}%" AND `;
        }
        if (searchMitemQuery.description != null && typeof searchMitemQuery.description !== 'undefined' && searchMitemQuery.description != "") {
            q += `mitem_description like "%${searchMitemQuery.description}%" AND `;
        }
        if (q.includes(" AND ")) {
            q = q.slice(0, -4);
        } else {
            q = q.slice(0, -6);
        }
    } else {
        q = q.slice(0, -6);
    }
    q += ` ORDER BY mitem_name ASC LIMIT ${step} OFFSET ${start}`;
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getSearchMitemsResult', rows);
            console.log("====>" + `getSearchMitemsResult from ${start} to ${(start + step)} successfull`);
        });
    });
    return q;
}

module.exports.reciveMitemCount = (q, mainWindow) => {
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getMitemCountResult', rows);
            console.log("====>" + `getMitemCount successfull`)
        });
    });
}

module.exports.deleteMitem = (mitem, mainWindow, mitemWindow) => {
    let data = [mitem.id];
    let sql = `DELETE FROM 'main'.'tab_mitems' WHERE mitem_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${mitem.name} successfull`);
            mitemWindow.hide();
            mainWindow.webContents.send('mitemsUpdated', { mitemStep, mitemStart });
            mainWindow.webContents.send('displayMessage', { type: `Deleted mitem`, message: `Deleted ${mitem.name} successful` });
        });
    });
}

module.exports.saveMitem = (mitem, mainWindow) => {
    let data = [mitem.name, mitem.type, mitem.rarity, mitem.description, mitem.pic, mitem.source, mitem.attunment, mitem.id];
    let sql = `UPDATE 'main'.'tab_mitems'
                SET mitem_name = ?, mitem_type = ?, mitem_rarity = ?, mitem_description = ?, mitem_pic = ?, mitem_source = ?, mitem_attunment = ?
                WHERE mitem_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${mitem.name} updated successfull`);
            mainWindow.webContents.send('mitemsUpdated', { mitemStep, mitemStart });
            mainWindow.webContents.send('displayMessage', { type: `Saved mitem`, message: `Saved ${mitem.name} successful` });
        });
    });
}

module.exports.saveNewMitem = (mitem, mainWindow) => {
    let data = [mitem.name, mitem.description, mitem.pic, mitem.rarity, mitem.type, mitem.source];
    let sql = `INSERT INTO 'main'.'tab_mitems' (mitem_name, mitem_description, mitem_pic, mitem_rarity, mitem_type, mitem_source)
                VALUES  (?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${mitem.name} successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added mitem`, message: `Added ${mitem.name} successful` });
        });
    });
}

module.exports.saveNewMitems = (mitems, mainWindow) => {
    mitems.forEach(mitem => {
        let data = [mitem.mitem_name, mitem.mitem_description, mitem.mitem_pic, mitem.mitem_rarity, mitem.mitem_type, mitem.mitem_source, mitem.mitem_attunment];
        let sql = `INSERT INTO 'main'.'tab_mitems' (mitem_name, mitem_description, mitem_pic, mitem_rarity, mitem_type, mitem_source, mitem_attunment)
                VALUES  (?, ?, ?, ?, ?, ?, ?)`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====>Added ${mitem.mitem_name} successfull`);
                mainWindow.webContents.send('displayMessage', { type: `Added mitem`, message: `Added ${mitem.mitem_name} successful` });
            });
        });
    });
}

module.exports.addMitemToChar = (char, mitem, mainWindow) => {
    let data = [char.selectedChar, mitem.id, 1, false, false];
    let sql = `INSERT INTO 'main'.'tab_characters_mitems' (char_id, mitem_id, mitem_amount, mitem_equiped, mitem_attuned)
                VALUES  (?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${mitem.name} to character successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added mitem to character`, message: `Added ${mitem.name} to character successful` });
        });
    });
}