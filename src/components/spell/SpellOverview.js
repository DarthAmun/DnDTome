import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/spell/SpellOverview.css';
import Spell from './Spell';
import { reciveSpells } from '../../database/SpellService';
import SearchBar from '../SearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellOverview() {
    const [currentSpellList, setCurrentSpellList] = useState({ spells: [] });
    const spells = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [start, setStart] = useState(-10);
    const [query, setQuery] = useState({});

    const receiveSpellsResult = (result) => {
        let newList = currentSpellList.spells
        newList = newList.concat(result);
        setCurrentSpellList({ spells: newList });
        setStart(start + 10);
    }

    const updateSpell = () => {
        spells.current.scrollTop = 0;
        setStart(10);
        reciveSpells(10, 0, query, function (result) {
            receiveSpellsResult(result)
        })
    }

    const searchSpell = (evt, rquery) => {
        setQuery(rquery.query);
        spells.current.scrollTop = 0;
        setStart(10);
        reciveSpells(10, 0, rquery.query, function (result) {
            receiveSpellsResult(result)
        })
    }

    useEffect(() => {
        ipcRenderer.on("spellsUpdated", updateSpell);
        ipcRenderer.on("sendSpellSearchQuery", searchSpell);
        return () => {
            ipcRenderer.removeListener("spellsUpdated", updateSpell);
            ipcRenderer.removeListener("sendSpellSearchQuery", searchSpell);
        }
    }, []);

    useEffect(() => {
        if (isFetching) {
            fetchMoreListItems();
        };
    }, [isFetching]);

    useEffect(() => {
        setIsFetching(false);
        if (spells.current.scrollHeight == spells.current.clientHeight) {
            reciveSpells(10, start + 10, query, function (result) {
                receiveSpellsResult(result);
            })
        }
    }, [currentSpellList]);


    const viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }

    const fetchMoreListItems = () => {
        reciveSpells(10, start + 10, query, function (result) {
            receiveSpellsResult(result);
        })
    }

    const handleScroll = () => {
        if (Math.round(spells.current.offsetHeight + spells.current.scrollTop) !== spells.current.scrollHeight) return;
        setIsFetching(true);
    }

    return (
        <div id="overview">
            <div id="spellOverview">
                <SearchBar inputs={["name", "school", "level", "duration", "time", "range", "components", "text", "classes", "sources"]} queryName="sendSpellSearchQuery" />
                <div id="spells" onScroll={handleScroll} ref={spells}>
                    {currentSpellList.spells.map((spell, index) => {
                        return <Spell delay={0} spell={spell} key={spell.spell_id} onClick={() => viewSpell(spell)} />;
                    })}
                </div>
            </div>
        </div>
    )

}
