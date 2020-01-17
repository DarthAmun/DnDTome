const path = window.require('path')
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;

let sqlite3 = window.require('sqlite3').verbose();
let db = new sqlite3.Database(path.join(app.getAppPath(), './src/assets/db/tab.db'));

module.exports.reciveAllChars = (callback) => {
    let q = "SELECT * FROM 'main'.'tab_characters' ORDER BY char_name";
    db.serialize(function () {
        db.all(q, function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getAllCharsResult successfull`)
        });
    });
}

module.exports.reciveChar = (id, callback) => {
    db.serialize(function () {
        db.get("SELECT * FROM 'main'.'tab_characters' WHERE char_id=?", [id], function (err, row) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(row);
            console.log("====>" + `getCharResult successfull`)
        });
    });
}

module.exports.reciveCharSpells = (id, callback) => {
    db.serialize(function () {
        db.all("SELECT * FROM 'main'.'tab_characters_spells' AS a LEFT JOIN 'main'.'tab_spells' AS b ON a.spell_id = b.spell_id WHERE char_id=? ORDER BY b.spell_level, b.spell_name", [id], function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getCharSpellsResult successfull`)
        });
    });
}

module.exports.reciveCharItems = (id, callback) => {
    db.serialize(function () {
        db.all("SELECT *, CASE WHEN b.item_name IS NOT NULL THEN b.item_name ELSE c.gear_name END as name FROM 'main'.'tab_characters_items' AS a LEFT JOIN 'main'.'tab_items' AS b ON a.item_id = b.item_id LEFT JOIN 'main'.'tab_gears' AS c ON a.gear_id = c.gear_id WHERE char_id=? ORDER BY name", [id], function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getCharItemsResult successfull`)
        });
    });
}

module.exports.reciveCharMonsters = (id, callback) => {
    db.serialize(function () {
        db.all("SELECT * FROM 'main'.'tab_characters_monsters' AS a LEFT JOIN 'main'.'tab_monsters' AS b ON a.monster_id = b.monster_id WHERE char_id=? ORDER BY b.monster_name", [id], function (err, rows) {
            if (err != null) {
                console.log("====>" + err);
            }
            callback(rows);
            console.log("====>" + `getCharMonstersResult successfull`)
        });
    });
}

module.exports.saveNewChar = (char, mainWindow) => {
    let data = [char.name, char.player, char.prof, char.level, char.pic, char.classes, char.race, char.background, char.ac, char.hp, char.currentHp, char.hitDice,
    char.init, char.speed, char.str, char.dex, char.con, char.int, char.wis, char.cha, char.strSave, char.dexSave, char.conSave, char.intSave, char.wisSave, char.chaSave,
    char.strSaveProf, char.dexSaveProf, char.conSaveProf, char.intSaveProf, char.wisSaveProf, char.chaSaveProf,
    char.actions, char.bonusActions, char.reactions, char.features, char.classFeatures, char.racialFeatures,
    char.profsLangs, char.senses, char.passivPerception, char.passivInsight, char.passivInvestigation, char.notesOne, char.notesTwo, char.notesThree,
    char.acrobatics, char.animalHandling, char.arcana, char.athletics, char.deception, char.history, char.insight, char.intimidation,
    char.investigation, char.medicine, char.nature, char.perception, char.performance, char.persuasion, char.religion, char.sleightOfHand,
    char.stealth, char.survival,
    char.acrobaticsProf, char.animalHandlingProf, char.arcanaProf, char.athleticsProf, char.deceptionProf, char.historyProf, char.insightProf, char.intimidationProf,
    char.investigationProf, char.medicineProf, char.natureProf, char.perceptionProf, char.performanceProf, char.persuasionProf, char.religionProf, char.sleightOfHandProf,
    char.stealthProf, char.survivalProf, char.spellNotes, char.alignment, char.inspiration, char.castingHit, char.castingDC];
    let sql = `INSERT INTO 'main'.'tab_characters'
                (char_name, char_player, char_prof, char_level, char_pic, char_classes, char_race, char_background, 
                char_ac, char_hp, char_hp_current, char_hitDice, char_init, char_speed, 
                char_str, char_dex, char_con, char_int, char_wis, char_cha, char_strSave, char_dexSave, char_conSave, char_intSave, char_wisSave, char_chaSave, 
                char_strSaveProf, char_dexSaveProf, char_conSaveProf, char_intSaveProf, char_wisSaveProf, char_chaSaveProf, 
                char_actions, char_bonusActions, char_reactions, char_features, char_classFeatures, char_racialFeatures, 
                char_profs_langs, char_senses, char_passivPerception, char_passivInsight, char_passivInvestigation, char_notesOne, 
                char_notesTwo, char_notesThree, char_acrobatics,   char_animalHandling, 
                char_arcana, char_athletics, char_deception, char_history, char_insight, char_intimidation, char_investigation, 
                char_medicine, char_nature, char_perception, char_performance, char_persuasion, char_religion, 
                char_sleightOfHand, char_stealth, char_survival, char_acrobaticsProf,   char_animalHandlingProf, 
                char_arcanaProf, char_athleticsProf, char_deceptionProf, char_historyProf, char_insightProf, char_intimidationProf, char_investigationProf, 
                char_medicineProf, char_natureProf, char_perceptionProf, char_performanceProf, char_persuasionProf, char_religionProf, 
                char_sleightOfHandProf, char_stealthProf, char_survivalProf, char_spellNotes, char_alignment, char_inspiration, char_castingHit, char_castingDC)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${char.name} updated successfull`);
            ipcRenderer.send('displayMessage', { type: `Saved character`, message: `Saved ${char.name} successful` });
        });
    });
}

module.exports.saveChar = (char) => {
    let data = [char.name, char.player, char.prof, char.level, char.pic, char.classes, char.race, char.background, char.ac, char.hp, char.currentHp, char.hitDice,
    char.init, char.speed, char.str, char.dex, char.con, char.int, char.wis, char.cha, char.strSave, char.dexSave, char.conSave, char.intSave, char.wisSave, char.chaSave,
    char.strSaveProf, char.dexSaveProf, char.conSaveProf, char.intSaveProf, char.wisSaveProf, char.chaSaveProf,
    char.actions, char.bonusActions, char.reactions, char.features, char.classFeatures, char.racialFeatures,
    char.profsLangs, char.senses, char.passivPerception, char.passivInsight, char.passivInvestigation, char.notesOne, char.notesTwo, char.notesThree,
    char.acrobatics, char.animalHandling, char.arcana, char.athletics, char.deception, char.history, char.insight, char.intimidation,
    char.investigation, char.medicine, char.nature, char.perception, char.performance, char.persuasion, char.religion, char.sleightOfHand,
    char.stealth, char.survival,
    char.acrobaticsProf, char.animalHandlingProf, char.arcanaProf, char.athleticsProf, char.deceptionProf, char.historyProf, char.insightProf, char.intimidationProf,
    char.investigationProf, char.medicineProf, char.natureProf, char.perceptionProf, char.performanceProf, char.persuasionProf, char.religionProf, char.sleightOfHandProf,
    char.stealthProf, char.survivalProf, char.spellNotes, char.alignment, char.inspiration, char.castingHit, char.castingDC, char.id];
    let sql = `UPDATE 'main'.'tab_characters'
                SET char_name = ?, char_player = ?, char_prof = ?, char_level = ?, char_pic = ?, char_classes = ?, char_race = ?, char_background = ?, 
                char_ac = ?, char_hp = ?, char_hp_current = ?, char_hitDice = ?, char_init = ?, char_speed = ?, 
                char_str = ?, char_dex = ?, char_con = ?, char_int = ?, char_wis = ?, char_cha = ?, char_strSave = ?, char_dexSave = ?, char_conSave = ?, char_intSave = ?, char_wisSave = ?, char_chaSave = ?, 
                char_strSaveProf = ?, char_dexSaveProf = ?, char_conSaveProf = ?, char_intSaveProf = ?, char_wisSaveProf = ?, char_chaSaveProf = ?, 
                char_actions = ?, char_bonusActions = ?, char_reactions = ?, char_features = ?, char_classFeatures = ?, char_racialFeatures = ?, 
                char_profs_langs = ?, char_senses = ?, char_passivPerception = ?, char_passivInsight = ?, char_passivInvestigation = ?, char_notesOne = ?, 
                char_notesTwo = ?, char_notesThree = ?, char_acrobatics = ?,   char_animalHandling = ?, 
                char_arcana = ?, char_athletics = ?, char_deception = ?, char_history = ?, char_insight = ?, char_intimidation = ?, char_investigation = ?, 
                char_medicine = ?, char_nature = ?, char_perception = ?, char_performance = ?, char_persuasion = ?, char_religion = ?, 
                char_sleightOfHand = ?, char_stealth = ?, char_survival = ?, char_acrobaticsProf = ?,   char_animalHandlingProf = ?, 
                char_arcanaProf = ?, char_athleticsProf = ?, char_deceptionProf = ?, char_historyProf = ?, char_insightProf = ?, char_intimidationProf = ?, char_investigationProf = ?, 
                char_medicineProf = ?, char_natureProf = ?, char_perceptionProf = ?, char_performanceProf = ?, char_persuasionProf = ?, char_religionProf = ?, 
                char_sleightOfHandProf = ?, char_stealthProf = ?, char_survivalProf = ?, char_spellNotes = ?, char_alignment = ?, char_inspiration = ?, char_castingHit = ?, char_castingDC = ?
                WHERE char_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====> ${char.name} updated successfull`);
            ipcRenderer.send('displayMessage', { type: `Saved character`, message: `Saved ${char.name} successful` });
        });
    });
}

module.exports.saveCharItems = (items) => {
    items.forEach(item => {
        let data = [item.item_amount, item.item_equiped, item.item_attuned, item.item_damage, item.item_hit, item.item_range, item.item_properties, item.id];
        let sql = `UPDATE 'main'.'tab_characters_items'
                SET item_amount = ?, item_equiped = ?, item_attuned = ?, item_damage = ?, item_hit = ?, item_range = ?, item_properties = ?
                WHERE id = ?`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====> ${item.item_name} updated successfull`);
            });
        });
    });
}

module.exports.saveCharSpells = (spells) => {
    spells.forEach(spell => {
        let data = [spell.spell_prepared, spell.id];
        let sql = `UPDATE 'main'.'tab_characters_spells'
                SET spell_prepared = ?
                WHERE id = ?`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====> ${spell.spell_name} updated successfull`);
            });
        });
    });
}

module.exports.saveNewChars = (chars) => {
    chars.forEach(char => {
        let data = [char.char_name, char.char_player, char.char_prof, char.char_level, char.char_pic, char.char_classes, char.char_race, char.char_background, char.char_ac, char.char_hp, char.char_hp_current, char.char_hitDice,
        char.char_init, char.char_speed, char.char_str, char.char_dex, char.char_con, char.char_int, char.char_wis, char.char_cha, char.char_strSave, char.char_dexSave, char.char_conSave, char.char_intSave, char.char_wisSave, char.char_chaSave,
        char.char_strSaveProf, char.char_dexSaveProf, char.char_conSaveProf, char.char_intSaveProf, char.char_wisSaveProf, char.char_chaSaveProf,
        char.char_actions, char.char_bonusActions, char.char_reactions, char.char_features, char.char_classFeatures, char.char_racialFeatures,
        char.char_profs_langs, char.char_senses, char.char_passivPerception, char.char_passivInsight, char.char_passivInvestigation, char.char_notesOne, char.char_notesTwo, char.char_notesThree,
        char.char_acrobatics, char.char_animalHandling, char.char_arcana, char.char_athletics, char.char_deception, char.char_history, char.char_insight, char.char_intimidation,
        char.char_investigation, char.char_medicine, char.char_nature, char.char_perception, char.char_performance, char.char_persuasion, char.char_religion, char.char_sleightOfHand,
        char.char_stealth, char.char_survival,
        char.char_acrobaticsProf, char.char_animalHandlingProf, char.char_arcanaProf, char.char_athleticsProf, char.char_deceptionProf, char.char_historyProf, char.char_insightProf, char.char_intimidationProf,
        char.char_investigationProf, char.char_medicineProf, char.char_natureProf, char.char_perceptionProf, char.char_performanceProf, char.char_persuasionProf, char.char_religionProf, char.char_sleightOfHandProf,
        char.char_stealthProf, char.char_survivalProf, char.char_spellNotes];
        let sql = `INSERT INTO 'main'.'tab_characters'
                    (char_name, char_player, char_prof, char_level, char_pic, char_classes, char_race, char_background, 
                    char_ac, char_hp, char_hp_current, char_hitDice, char_init, char_speed, 
                    char_str, char_dex, char_con, char_int, char_wis, char_cha, char_strSave, char_dexSave, char_conSave, char_intSave, char_wisSave, char_chaSave, 
                    char_strSaveProf, char_dexSaveProf, char_conSaveProf, char_intSaveProf, char_wisSaveProf, char_chaSaveProf, 
                    char_actions, char_bonusActions, char_reactions, char_features, char_classFeatures, char_racialFeatures, 
                    char_profs_langs, char_senses, char_passivPerception, char_passivInsight, char_passivInvestigation, char_notesOne, 
                    char_notesTwo, char_notesThree, char_acrobatics,   char_animalHandling, 
                    char_arcana, char_athletics, char_deception, char_history, char_insight, char_intimidation, char_investigation, 
                    char_medicine, char_nature, char_perception, char_performance, char_persuasion, char_religion, 
                    char_sleightOfHand, char_stealth, char_survival, char_acrobaticsProf,   char_animalHandlingProf, 
                    char_arcanaProf, char_athleticsProf, char_deceptionProf, char_historyProf, char_insightProf, char_intimidationProf, char_investigationProf, 
                    char_medicineProf, char_natureProf, char_perceptionProf, char_performanceProf, char_persuasionProf, char_religionProf, 
                    char_sleightOfHandProf, char_stealthProf, char_survivalProf, char_spellNotes)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.serialize(function () {
            db.run(sql, data, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`====>Added ${char.char_name} successfull`);
                ipcRenderer.send('displayMessage', { type: `Added character`, message: `Added ${char.char_name} successful` });
            });
        });
    });
}

module.exports.saveNewCharFromJson = (char, callback) => {
    let data = [char.char_name, char.char_player, char.char_prof, char.char_level, char.char_pic, char.char_classes, char.char_race, char.char_background, char.char_ac, char.char_hp, char.char_hp_current, char.char_hitDice,
    char.char_init, char.char_speed, char.char_str, char.char_dex, char.char_con, char.char_int, char.char_wis, char.char_cha, char.char_strSave, char.char_dexSave, char.char_conSave, char.char_intSave, char.char_wisSave, char.char_chaSave,
    char.char_strSaveProf, char.char_dexSaveProf, char.char_conSaveProf, char.char_intSaveProf, char.char_wisSaveProf, char.char_chaSaveProf,
    char.char_actions, char.char_bonusActions, char.char_reactions, char.char_features, char.char_classFeatures, char.char_racialFeatures,
    char.char_profs_langs, char.char_senses, char.char_passivPerception, char.char_passivInsight, char.char_passivInvestigation, char.char_notesOne, char.char_notesTwo, char.char_notesThree,
    char.char_acrobatics, char.char_animalHandling, char.char_arcana, char.char_athletics, char.char_deception, char.char_history, char.char_insight, char.char_intimidation,
    char.char_investigation, char.char_medicine, char.char_nature, char.char_perception, char.char_performance, char.char_persuasion, char.char_religion, char.char_sleightOfHand,
    char.char_stealth, char.char_survival,
    char.char_acrobaticsProf, char.char_animalHandlingProf, char.char_arcanaProf, char.char_athleticsProf, char.char_deceptionProf, char.char_historyProf, char.char_insightProf, char.char_intimidationProf,
    char.char_investigationProf, char.char_medicineProf, char.char_natureProf, char.char_perceptionProf, char.char_performanceProf, char.char_persuasionProf, char.char_religionProf, char.char_sleightOfHandProf,
    char.char_stealthProf, char.char_survivalProf, char.char_spellNotes, char.char_alignment, char.char_inspiration, char.char_castingHit, char.char_castingDC];
    let sql = `INSERT INTO 'main'.'tab_characters'
                    (char_name, char_player, char_prof, char_level, char_pic, char_classes, char_race, char_background, 
                    char_ac, char_hp, char_hp_current, char_hitDice, char_init, char_speed, 
                    char_str, char_dex, char_con, char_int, char_wis, char_cha, char_strSave, char_dexSave, char_conSave, char_intSave, char_wisSave, char_chaSave, 
                    char_strSaveProf, char_dexSaveProf, char_conSaveProf, char_intSaveProf, char_wisSaveProf, char_chaSaveProf, 
                    char_actions, char_bonusActions, char_reactions, char_features, char_classFeatures, char_racialFeatures, 
                    char_profs_langs, char_senses, char_passivPerception, char_passivInsight, char_passivInvestigation, char_notesOne, 
                    char_notesTwo, char_notesThree, char_acrobatics,   char_animalHandling, 
                    char_arcana, char_athletics, char_deception, char_history, char_insight, char_intimidation, char_investigation, 
                    char_medicine, char_nature, char_perception, char_performance, char_persuasion, char_religion, 
                    char_sleightOfHand, char_stealth, char_survival, char_acrobaticsProf,   char_animalHandlingProf, 
                    char_arcanaProf, char_athleticsProf, char_deceptionProf, char_historyProf, char_insightProf, char_intimidationProf, char_investigationProf, 
                    char_medicineProf, char_natureProf, char_perceptionProf, char_performanceProf, char_persuasionProf, char_religionProf, 
                    char_sleightOfHandProf, char_stealthProf, char_survivalProf, char_spellNotes, char_alignment, char_inspiration, char_castingHit, char_castingDC)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Added ${char.char_name} successfull`);
            ipcRenderer.send('displayMessage', { type: `Added character`, message: `Added ${char.char_name} successful` });
            callback(this.lastID);
        });
    });
}

module.exports.deleteCharSpell = (spell) => {
    let data = [spell.id];
    let sql = `DELETE FROM 'main'.'tab_characters_spells' WHERE id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed ${spell.spell_name} successfull`);
            ipcRenderer.send('displayMessage', { type: `Removed spell`, message: `Removed ${spell.spell_name} successful` });
        });
    });
}


module.exports.deleteCharItem = (item) => {
    let data = [item.id];
    let sql = `DELETE FROM 'main'.'tab_characters_items' WHERE id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed ${item.item_name} successfull`);
            ipcRenderer.send('displayMessage', { type: `Removed item`, message: `Removed ${item.item_name} successful` });
        });
    });
}

module.exports.deleteCharMonster = (monster) => {
    let data = [monster.monster_id];
    let sql = `DELETE FROM 'main'.'tab_characters_monsters' WHERE monster_id = ?`;
    db.serialize(function () {
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed ${monster.monster_name} successfull`);
            ipcRenderer.send('displayMessage', { type: `Removed monster`, message: `Removed ${monster.monster_name} successful` });
        });
    });
}

module.exports.deleteChar = (id) => {
    let data = [id];
    let sql1 = `DELETE FROM 'main'.'tab_characters_items' WHERE char_id = ?`;
    let sql2 = `DELETE FROM 'main'.'tab_characters_spells' WHERE char_id = ?`;
    let sql3 = `DELETE FROM 'main'.'tab_characters_monsters' WHERE char_id = ?`;
    let sql4 = `DELETE FROM 'main'.'tab_characters' WHERE char_id = ?`;
    db.serialize(function () {
        db.run(sql1, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed items from character successful`);
        });
        db.run(sql2, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed spells from character successful`);
        });
        db.run(sql3, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed monsters from character successful`);
        });
        db.run(sql4, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`====>Removed character successfull`);
            ipcRenderer.send('closeActiveView');
            ipcRenderer.send('displayMessage', { type: `Deleted character`, message: `Deleted character successful` });
        });
    });
}

module.exports.deleteAllCharacters = () => {
    db.serialize(function() {
      db.run(`DELETE FROM tab_characters_spells`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> All from characters_spells successful deleted`);
        ipcRenderer.send("displayMessage", {
          type: `Delete All character spells`,
          message: "delete all successful",
        });
      });
      db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_spells'`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> characters_spells autoincreasement reseted successful`);
      });
  
      db.run(`DELETE FROM tab_characters_items`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> All from characters_items successful deleted`);
        ipcRenderer.send("displayMessage", {
          type: `Delete All character items`,
          message: "delete all successful",
        });
      });
      db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_items'`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> characters_sitems autoincreasement reseted successful`);
      });
  
      db.run(`DELETE FROM tab_characters_monsters`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> All from characters_monsters successful deleted`);
        ipcRenderer.send("displayMessage", {
          type: `Delete All character monsters`,
          message: "delete all successful",
        });
      });
      db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters_monsters'`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> characters_monsters autoincreasement reseted successful`);
      });
  
      db.run(`DELETE FROM tab_characters`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> All from characters successful deleted`);
        ipcRenderer.send("displayMessage", {
          type: `Delete All characters`,
          message: "delete all successful",
        });
      });
      db.run(`DELETE FROM sqlite_sequence WHERE name='tab_characters'`, function(err) {
        if (err != null) {
          console.log("====>" + err);
        }
        console.log(`====> characters autoincreasement reseted successful`);
      });
    });
  };