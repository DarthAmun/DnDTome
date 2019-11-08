const path = window.require('path')
const electron = window.require('electron');
const { app } = electron.remote;

console.log(path.join(app.getAppPath(), './src/assets/db/tab.db'));
let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

module.exports.get = (key, callback) => {
    let q = "SELECT option_value FROM 'main'.'tab_options' WHERE option_type=?";
    db.serialize(function () {
        db.get(q, [key], function (err, row) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(row.option_value);
        });
    });
}

module.exports.set = (key, value) => {
    let data = [value, key];
    let sql = `UPDATE 'main'.'tab_options' SET option_value = ? WHERE option_type = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${key} updated successfull`);
        });
    });
}