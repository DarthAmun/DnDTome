import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/monster/MonsterOverview.css';
import Monster from './Monster';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function MonsterOverview() {
    const [currentMonsterList, setCurrentMonsterList] = useState({ monsters: [] });
    const monsters = useRef(null);

    const receiveMonsters = (evt, result) => {
        setCurrentMonsterList({ monsters: result });
        monsters.current.scrollTop = 0;
    }

    const updateMonster = (evt, result) => {
        let { monsterStep, monsterStart } = result;
        ipcRenderer.send('getSearchMonsters', { step: monsterStep, start: monsterStart });
    }

    useEffect(() => {
        ipcRenderer.send('getSearchMonsters', { step: 10, start: 0 });
        ipcRenderer.on("getSearchMonstersResult", receiveMonsters);
        ipcRenderer.on("monstersUpdated", updateMonster);
        return () => {
            ipcRenderer.removeListener("getSearchMonstersResult", receiveMonsters);
            ipcRenderer.removeListener("monstersUpdated", updateMonster);
        }
    }, []);

    const viewMonster = (monster) => {
        ipcRenderer.send('openMonsterView', monster);
    }

    return (
        <div id="overview">
            <div id="monsterOverview">
                <SearchBar inputs={["name", "type", "subtype", "cr", "alignment", "speed", "damage", "senses", "ability", "action"]} queryName="sendMonsterSearchQuery" />
                <div id="monsters" ref={monsters}>
                    {currentMonsterList.monsters.map((monster, index) => {
                        return <Monster delay={index} monster={monster} key={monster.monster_id} onClick={() => viewMonster(monster)} />;
                    })}
                </div>
            </div>
            <Pagination name="Monster" />
        </div >
    )

}
