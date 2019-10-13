import React, { Component } from 'react';
import '../../assets/css/monster/MonsterOverview.css';
import Monster from './Monster';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class MonsterOverview extends Component {
    state = {
        currentMonsterList: { monsters: [] },
        currentSelectedMonster: null
    }

    receiveMonsters = (evt, result) => {
        this.setState({
            ...this.state,
            currentMonsterList: {
                monsters: result
            }
        })
    }

    updateMonster = (evt, result) => {
        let { monsterStep, monsterStart } = result;
        ipcRenderer.send('getSearchMonsters', { step: monsterStep, start: monsterStart });
    }

    componentDidMount() {
        ipcRenderer.send('getSearchMonsters', { step: 10, start: 0 });
        ipcRenderer.on("getSearchMonstersResult", this.receiveMonsters);
        ipcRenderer.on("monstersUpdated", this.updateMonster);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getSearchMonstersResult", this.receiveMonsters);
        ipcRenderer.removeListener("monstersUpdated", this.updateMonster);
    }

    viewMonster = (monster) => {
        ipcRenderer.send('openMonsterView', monster);
    }

    render() {
        return (
            <div id="overview">
                <div id="monsterOverview">
                    <SearchBar inputs={["name", "type", "subtype", "cr", "alignment", "speed", "damage", "senses", "ability", "action"]} queryName="sendMonsterSearchQuery" />
                    <div id="monsters">
                        {this.state.currentMonsterList.monsters.map((monster, index) => {
                            return <Monster delay={index} monster={monster} key={monster.monster_id} onClick={() => this.viewMonster(monster)} />;
                        })}
                    </div>
                </div>
                <Pagination name="Monster" />
            </div>
        )
    }
}

export default MonsterOverview;