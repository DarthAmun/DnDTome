const path = require('path')

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(__dirname, '../assets/db/tab.db'));
let itemStep;
let itemStart;
let searchItemQuery;

module.exports.reciveAllItems = (mainWindow) => {
    let q = "SELECT * FROM 'main'.'tab_items'";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getAllItemsResult', rows);
            console.log("====>" + `getAllItemsResult successfull`)
        });
    });
}

module.exports.reciveItems = (step, start, query, mainWindow) => {
    itemStep = step;
    itemStart = start;
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
        if (searchItemQuery.rarity != null && typeof searchItemQuery.rarity !== 'undefined' && searchItemQuery.rarity != "") {
            q += `item_rarity like "%${searchItemQuery.rarity}%" AND `;
        }
        if (searchItemQuery.type != null && typeof searchItemQuery.type !== 'undefined' && searchItemQuery.type != "") {
            q += `item_type like "%${searchItemQuery.type}%" AND `;
        }
        if (searchItemQuery.source != null && typeof searchItemQuery.source !== 'undefined' && searchItemQuery.source != "") {
            q += `item_source like "%${searchItemQuery.source}%" AND `;
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
            mainWindow.webContents.send('getSearchItemsResult', rows);
            console.log("====>" + `getSearchItemsResult from ${start} to ${(start + step)} successfull`);
        });
    });
    return q;
}

module.exports.reciveItemCount = (q, mainWindow) => {
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            mainWindow.webContents.send('getItemCountResult', rows);
            console.log("====>" + `getItemCount successfull`)
        });
    });
}

module.exports.deleteItem = (item, mainWindow, itemWindow) => {
    let data = [item.id];
    let sql = `DELETE FROM 'main'.'tab_items' WHERE item_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Deleted ${item.name} successfull`);
            itemWindow.hide();
            mainWindow.webContents.send('itemsUpdated', { itemStep, itemStart });
            mainWindow.webContents.send('displayMessage', { type: `Deleted magic item`, message: `Deleted ${item.name} successful` });
        });
    });
}

module.exports.saveItem = (item, mainWindow) => {
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
            mainWindow.webContents.send('itemsUpdated', { itemStep, itemStart });
            mainWindow.webContents.send('displayMessage', { type: `Saved magic item`, message: `Saved ${item.name} successful` });
        });
    });
}

module.exports.saveNewItem = (item, mainWindow) => {
    let data = [item.name, item.description, item.pic, item.rarity, item.type, item.source];
    let sql = `INSERT INTO 'main'.'tab_items' (item_name, item_description, item_pic, item_rarity, item_type, item_source)
                VALUES  (?, ?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${item.name} successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added magic item`, message: `Added ${item.name} successful` });
        });
    });
}

module.exports.saveNewItems = (items, mainWindow) => {
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
                mainWindow.webContents.send('updateItemImport', { now: ItemImported, full: ItemImportLength, name: item.item_name });
            });
        });
    });
}

module.exports.addItemToChar = (char, item, mainWindow) => {
    let data = [char.selectedChar, item.id, 1, false, false];
    let sql = `INSERT INTO 'main'.'tab_characters_items' (char_id, item_id, item_amount, item_equiped, item_attuned)
                VALUES  (?, ?, ?, ?, ?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${item.name} to character successfull`);
            mainWindow.webContents.send('displayMessage', { type: `Added magic item to character`, message: `Added ${item.name} to character successful` });
        });
    });
}