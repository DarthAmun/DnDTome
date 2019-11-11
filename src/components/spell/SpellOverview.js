import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/spell/SpellOverview.css';
import Spell from './Spell';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellOverview() {
    const [currentSpellList, setCurrentSpellList] = useState({ spells: [] });
    const spells = useRef(null);

    const receiveSpells = (evt, result) => {
        setCurrentSpellList({ spells: result });
        spells.current.scrollTop = 0;
    }

    const updateSpell = (evt, result) => {
        let { spellStep, spellStart } = result;
        ipcRenderer.send('getSearchSpells', { step: spellStep, start: spellStart });
    }

    useEffect(() => {
        ipcRenderer.send('getSearchSpells', { step: 10, start: 0 });
        ipcRenderer.on("getSearchSpellsResult", receiveSpells);
        ipcRenderer.on("spellsUpdated", updateSpell);
        return () => {
            ipcRenderer.removeListener("getSearchSpellsResult", receiveSpells);
            ipcRenderer.removeListener("spellsUpdated", updateSpell);
        }
    }, []);

    const viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }

    return (
        <div id="overview">
            <div id="spellOverview">
                <SearchBar inputs={["name", "school", "level", "duration", "time", "range", "components", "text", "classes", "sources"]} queryName="sendSpellSearchQuery" />
                <div id="spells" ref={spells}>
                    {currentSpellList.spells.map((spell, index) => {
                        return <Spell delay={index} spell={spell} key={spell.spell_id} onClick={() => viewSpell(spell)} />;
                    })}
                </div>
            </div>
            <Pagination name="Spell" />
        </div>
    )

}
