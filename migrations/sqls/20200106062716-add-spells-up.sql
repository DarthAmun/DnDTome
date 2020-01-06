/* Replace with your SQL commands */
create TABLE tab_spells (
spell_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
spell_name TEXT NOT NULL, spell_level INT NOT NULL,
spell_school CHAR (255),
 spell_time TEXT,
  spell_ritual INT (4),
   spell_range TEXT,
    spell_components TEXT,
     spell_duration TEXT,
      spell_classes TEXT,
       spell_text TEXT,
        spell_sources TEXT,
         spell_pic TEXT);
