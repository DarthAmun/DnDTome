const path = window.require('path')
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;

let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

let itemStep;
let itemStart;
let searchItemQuery;

module.exports.reciveAllItems = (callback) => {
    let q = "SELECT * FROM 'main'.'tab_items' ORDER BY item_name";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getAllItemsResult successfull`)
        });
    });
}
module.exports.reciveItemByName = (name, callback) => {
    db.serialize(function () {
        db.get("SELECT * FROM 'main'.'tab_items' WHERE item_name=?", [name], function (err, row) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(row);
            console.log("====>" + `getSpell successfull`)
        });
    });
}

module.exports.reciveItems = (step, start, query, callback) => {
    localStorage.setItem('itemStep', parseInt(step, 10));
    localStorage.setItem('itemStart', parseInt(start, 10));

    if (query !== null) {
        searchItemQuery = query;
    }
    let q = "SELECT * FROM 'main'.'tab_items' WHERE ";
    if (searchItemQuery != null) {
        if (searchItemQuery.name != null && typeof searchItemQuery.name !== 'undefined' && searchItemQuery.name != "") {
            q += `item_name like "%${searchItemQuery.name}%" AND `;
        }
        if (searchItemQuery.description != null && typeof searchItemQuery.description !== 'undefined' && searchItemQuery.description != "") {
            q += `item_description like "%${searchItemQuery.description}%" AND `;
        }
        if (searchItemQuery.rarity != null && typeof searchItemQuery.rarity !== 'undefined' && searchItemQuery.rarity != "" && searchItemQuery.rarity.length !== 0) {
            searchItemQuery.rarity.map(rarity => {
                q += `item_rarity = "${rarity.value}" OR `;
            });
            q = q.slice(0, -3);
            q += "AND ";
        }
        if (searchItemQuery.type != null && typeof searchItemQuery.type !== 'undefined' && searchItemQuery.type != "" && searchItemQuery.type.length !== 0) {
            searchItemQuery.type.map(type => {
                q += `item_type = "${type.value}" OR `;
            });
            q = q.slice(0, -3);
            q += "AND ";
        }
        if (searchItemQuery.source != null && typeof searchItemQuery.source !== 'undefined' && searchItemQuery.source != "") {
            q += `item_source like "%${searchItemQuery.source}%" AND `;
        }
        if (searchItemQuery.attunment != null && typeof searchItemQuery.attunment !== 'undefined' && searchItemQuery.attunment != "") {
            q += `item_attunment = ${searchItemQuery.attunment} AND `;
        }
        if (q.includes(" AND ")) {
            q = q.slice(0, -4);
        } else {
            q = q.slice(0, -6);
        }
    } else {
        q = q.slice(0, -6);
    }
    q += ` ORDER BY item_name ASC LIMIT ${step} OFFSET ${start}`;
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getSearchItemsResult from ${start} to ${(start + step)} successfull`);
        });
    });
    return q;
}

module.exports.reciveItemCount = (query, callback) => {
    const q = this.reciveItems(10, 0, query, function (result) { });
    const sql = q.replace("SELECT * FROM 'main'.'tab_items'", "SELECT count(*) AS count FROM 'main'.'tab_items'");
    db.serialize(function () {
        db.all(sql, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows[0]);
            console.log("====>" + `getItemCount successfull`)
        });
    });
}

module.exports.reciveAttributeSelection = (attribute, callback) => {
    let q = `SELECT item_${attribute} FROM 'main'.'tab_items' GROUP BY item_${attribute} ORDER BY item_${attribute}`;
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

module.exports.saveItem = (item) => {
    let data = [item.name, item.type, item.rarity, item.description, item.pic, item.source, item.attunment, item.id];
    let sql = `UPDATE 'main'.'tab_items'
                SET item_name = ?, item_type = ?, item_rarity = ?, item_description = ?, item_pic = ?, item_source = ?, item_attunment = ?
                WHERE item_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${item.name} updated successfull`);
            ipcRenderer.send('itemsUpdated', { itemStep: parseInt(localStorage.getItem('itemStep'), 10), itemStart: parseInt(localStorage.getItem('itemStart'), 10) });
            ipcRenderer.send('displayMessage', { type: `Saved magic item`, message: `Saved ${item.name} successful` });
        });
    });
}

module.exports.saveNewItem = (item) => {
    let data = [item.name, item.description, item.pic, item.rarity, item.type, item.source];
    let sql = `INSERT INTO 'main'.'tab_items' (item_name, item_description, item_pic, item_rarity, item_type, item_source)
                VALUES  (?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${item.name} successfull`);
            ipcRenderer.send('displayMessage', { type: `Added magic item`, message: `Added ${item.name} successful` });
        });
    });
}

module.exports.saveNewItems = (items, callback) => {
    let ItemImportLength = Object.keys(items).length;
    let ItemImported = 0;
    items.forEach(item => {
        let data = [item.item_name, item.item_description, item.item_pic, item.item_rarity, item.item_type, item.item_source, item.item_attunment];
        let sql = `INSERT INTO 'main'.'tab_items' (item_name, item_description, item_pic, item_rarity, item_type, item_source, item_attunment)
                VALUES  (?, ?, ?, ?, ?, ?, ?)`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====>Added ${item.item_name} successfull`);
                ItemImported++;
                callback({ now: ItemImported, full: ItemImportLength, name: item.item_name });
            });
        });
    });
}

module.exports.saveNewItemFromJson = (item, callback) => {
    let data = [item.item_name, item.item_description, item.item_pic, item.item_rarity, item.item_type, item.item_source, item.item_attunment];
    let sql = `INSERT INTO 'main'.'tab_items' (item_name, item_description, item_pic, item_rarity, item_type, item_source, item_attunment)
                VALUES  (?, ?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${item.item_name} successfull`);
            callback(this.lastID);
        });
    });
}

module.exports.deleteItem = (item) => {
    let data = [item.id];
    let sql1 = `DELETE FROM 'main'.'tab_items' WHERE item_id = ?`;
    let sql2 = `DELETE FROM 'main'.'tab_characters_items' WHERE item_id = ?`;
    db.serialize(function () {
        db.run(sql2, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${item.name} from characters successfull`);
        });
        db.run(sql1, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${item.name} successfull`);
            ipcRenderer.send('closeActiveView');
            ipcRenderer.send('removeWindow', item);
            ipcRenderer.send('displayMessage', { type: `Deleted magic item`, message: `Deleted ${item.name} successful` });
        });
    });
}

module.exports.deleteAllItems = () => {
    db.serialize(function () {
        db.run(`DELETE FROM tab_characters_items`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> All from characters_items successful deleted`);
            ipcRenderer.send("displayMessage", { type: `Delete All items`, message: "delete all successful" });
        });
        db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_items'`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> characters_items autoincreasement reseted successful`);
        });
        db.run(`DELETE FROM tab_items`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> All from items successful deleted`);
            ipcRenderer.send("displayMessage", { type: `Delete All items`, message: "delete all successful" });
        });
        db.run(`DELETE FROM sqlite_sequence WHERE name='tab_items'`, function (err) {
            if (err != null) {
                console.log("====>" + err);
            }
            console.log(`====> items autoincreasement reseted successful`);
        });
    });
};

module.exports.addItemToChar = (char, item, callback) => {
    let data = [];
    if (item.id === undefined) {
        data = [char.selectedChar, item.item_id, 1, false, false];
    } else {
        data = [char.selectedChar, item.id, 1, false, false];
    }
    let sql = `INSERT INTO 'main'.'tab_characters_items' (char_id, item_id, item_amount, item_equiped, item_attuned)
                VALUES  (?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${item.name} to character successfull`);
            ipcRenderer.send('displayMessage', { type: `Added magic item to character`, message: `Added ${item.name} to character successful` });
            callback();
        });
    });
}