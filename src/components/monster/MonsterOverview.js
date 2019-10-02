import React, { Component } from 'react';
import '../../assets/css/monster/MonsterOverview.css';
import Monster from './Monster';
import MonsterPagination from './MonsterPagination';
import MonsterSearchBar from './MonsterSearchBar';

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
                    <MonsterSearchBar />
                    <div id="monsters">
                        {this.state.currentMonsterList.monsters.map((monster, index) => {
                            return <Monster delay={index} monster={monster} key={monster.monster_id} onClick={() => this.viewMonster(monster)} />;
                        })}
                    </div>
                </div>
                <MonsterPagination />
            </div>
        )
    }
}

export default MonsterOverview;