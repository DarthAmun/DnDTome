import React, { Component } from 'react';
import '../../assets/css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class MonsterSearchBar extends Component {
    state = {
        query: {
            name: "",
            type: "",
            subtype: "",
            cr: "",
            alignment: "",
            speed: "",
            damage: "",
            senses: "",
            ability: "",
            action: ""
        }
    }

    changeName = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                name: event.target.value
            }
        });
    }
    changeType = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                type: event.target.value
            }
        });
    }
    changeSubtype = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                subtype: event.target.value
            }
        });
    }
    changeCR = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                cr: event.target.value
            }
        });
    }
    changeAlignment = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                alignment: event.target.value
            }
        });
    }
    changeSpeed = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                speed: event.target.value
            }
        });
    }
    changeDamage = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                damage: event.target.value
            }
        });
    }
    changeSenses = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                senses: event.target.value
            }
        });
    }
    changeAbility = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                ability: event.target.value
            }
        });
    }
    changeAction = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                action: event.target.value
            }
        });
    }

    sendQuery = (e) => {
        if (e.key === 'Enter') {
            ipcRenderer.send('sendMonsterSearchQuery', { query: this.state.query });
        }
    }

    resetSearch = (e) => {
        this.setState({
            ...this.state,
            query: {
                name: "",
                type: "",
                subtype: "",
                cr: "", 
                alignment: "",
                speed: "",
                damage: "",
                senses: "",
                ability: "",
                action: ""
            }
        });
        ipcRenderer.send('sendMonsterSearchQuery', { query: {} });
    }

    render() {
        return (
            <div id="searchBar">
                <input type="text" style={{width: "180px"}} placeholder="Name" value={this.state.query.name} onChange={this.changeName} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Type" value={this.state.query.type} onChange={this.changeType} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Subtype" value={this.state.query.subtype} onChange={this.changeSubtype} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "20px"}} placeholder="Cr" value={this.state.query.cr} onChange={this.changeCR} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Alignment" value={this.state.query.alignment} onChange={this.changeAlignment} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Speed" value={this.state.query.speed} onChange={this.changeSpeed} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Senses" value={this.state.query.senses} onChange={this.changeSenses} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Damage" value={this.state.query.damage} onChange={this.changeDamage} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "180px"}} placeholder="Ability" value={this.state.query.ability} onChange={this.changeAbility} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "180px"}} placeholder="Action" value={this.state.query.action} onChange={this.changeAction} onKeyDown={this.sendQuery}></input>
                <button onClick={this.resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
            </div>
        )
    }
}

export default MonsterSearchBar;