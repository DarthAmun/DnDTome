import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/spell/SpellOverview.css';
import Spell from './Spell';
import { reciveSpells, reciveSpellCount } from '../../database/SpellService';
import SearchBar from '../SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellOverview() {
    const [currentSpellList, setCurrentSpellList] = useState({ spells: [] });
    const spells = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [start, setStart] = useState(0);
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

        reciveSpellCount(query, function (result) {
            let spellCount = result.count;
            console.log(result)
            if (spellCount > currentSpellList.spells.length) {
                if (!currentSpellList.spells.length) {
                    reciveSpells(10, start, query, function (result) {
                        receiveSpellsResult(result);
                    })
                }
                if (spells.current.scrollHeight == spells.current.clientHeight
                    && currentSpellList.spells.length) {
                    reciveSpells(10, start + 10, query, function (spells) {
                        receiveSpellsResult(spells);
                    })
                }
            }
        })
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
        if (Math.round(spells.current.offsetHeight + spells.current.scrollTop) < (spells.current.scrollHeight - 240)) return;
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
            <Link to={`/add-spell`} className="button">
                <FontAwesomeIcon icon={faPlus} /> Add new Spell
            </Link>
        </div>
    )

}
