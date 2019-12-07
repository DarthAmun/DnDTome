import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/spell/SpellOverview.css';
import Spell from './Spell';
import { reciveSpells, reciveSpellCount } from '../../database/SpellService';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellOverview() {
    const [currentSpellList, setCurrentSpellList] = useState({ spells: [] });
    const [count, setCount] = useState(0);
    const spells = useRef(null);

    const receiveSpellsResult = (result) => {
        setCurrentSpellList({ spells: result });
        spells.current.scrollTop = 0;
    }

    const updateSpell = (evt, result) => {
        let { spellStep, spellStart } = result;
        reciveSpells(spellStep, spellStart, null, function (result) {
            receiveSpellsResult(result)
        })
    }

    useEffect(() => {
        reciveSpells(10, 0, null, function (result) {
            receiveSpellsResult(result);
        })
        reciveSpellCount(function (result) {
            setCount(result.count);
        });
        ipcRenderer.on("spellsUpdated", updateSpell);
        return () => {
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
            <Pagination initCount={count} />
        </div>
    )

}
