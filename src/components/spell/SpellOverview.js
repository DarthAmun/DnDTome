import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import '../../assets/css/spell/SpellOverview.css';
import Spell from './Spell';
import { reciveAllSpells } from '../../database/SpellService';
import SpellSearchBar from './SpellSearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellOverview() {
    const [currentSpellList, setCurrentSpellList] = useState({ spells: [] });
    const [spellList, setSpellList] = useState({ spells: [] });

    useEffect(() => {
        console.time("init")
        reciveAllSpells(function (spells) {
            ReactDOM.unstable_batchedUpdates(() => {
                setCurrentSpellList({ spells: spells });
                setSpellList({ spells: spells });
            });
            console.timeEnd("init")
        });
        // ipcRenderer.on("spellsUpdated", updateSpell);
        // return () => {
        //     ipcRenderer.removeListener("spellsUpdated", updateSpell);
        // }
    }, []);

    const viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }

    const searchFilter = (searchObject) => {
        console.time("filterSpells")
        let searchedSpells = spellList.spells.filter(function (spell) {
            let schoolbool = false;
            if (searchObject.school !== null && searchObject.school.length !== 0) {
                searchObject.school.map(school => {
                    schoolbool = schoolbool || spell.spell_school.toLowerCase().includes(school.value.toLowerCase());
                });
            } else {
                schoolbool = true;
            }
            let levelbool = false;
            if (searchObject.level !== null && searchObject.level.length !== 0) {
                searchObject.level.map(level => {
                    levelbool = levelbool || spell.spell_level === level.value;
                });
            } else {
                levelbool = true;
            }

            let bool = spell.spell_name.toLowerCase().includes(searchObject.name.toLowerCase())
                && schoolbool
                && levelbool;

            return bool;
        });
        setCurrentSpellList({ spells: searchedSpells });
        console.timeEnd("filterSpells")
    }

    return (
        <div id="overview">
            <div id="spellOverview">
                <SpellSearchBar callback={searchObject => searchFilter(searchObject)} />
                <div id="spells">
                    {currentSpellList.spells.map((spell, index) => {
                        return <Spell delay={0} spell={spell} key={spell.spell_id} onClick={() => viewSpell(spell)} />;
                    })}
                </div>
            </div>
            <Link to={`/add-spell`} className="button">
                <FontAwesomeIcon icon={faPlus} /> Add new Spell
            </Link>
        </div>
    )

}
