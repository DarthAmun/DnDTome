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
            school: "",
            level: "",
            time: "",
            range: "",
            duration: "",
            components: "",
            text: "",
            classes: "",
            sources: ""
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
    changeSchool = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                school: event.target.value
            }
        });
    }
    changeLevel = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                level: event.target.value
            }
        });
    }
    changeTime = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                time: event.target.value
            }
        });
    }
    changeRange = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                range: event.target.value
            }
        });
    }
    changeDuration = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                duration: event.target.value
            }
        });
    }
    changeComponents = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                components: event.target.value
            }
        });
    }
    changeClasses = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                classes: event.target.value
            }
        });
    }
    changeSources = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                sources: event.target.value
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
                school: "",
                level: "",
                time: "",
                range: "",
                duration: "",
                components: "",
                text: "",
                classes: "",
                sources: ""
            }
        });
        ipcRenderer.send('sendMonsterSearchQuery', { query: {} });
    }

    render() {
        return (
            <div id="searchBar">
                <input type="text" style={{width: "180px"}} placeholder="Name" value={this.state.query.name} onChange={this.changeName} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="School" value={this.state.query.school} onChange={this.changeSchool} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "40px"}} placeholder="Level" value={this.state.query.level} onChange={this.changeLevel} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Casting Time" value={this.state.query.time} onChange={this.changeTime} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Range" value={this.state.query.range} onChange={this.changeRange} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Duration" value={this.state.query.duration} onChange={this.changeDuration} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Components" value={this.state.query.components} onChange={this.changeComponents} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Classes" value={this.state.query.classes} onChange={this.changeClasses} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "80px"}} placeholder="Sources" value={this.state.query.sources} onChange={this.changeSources} onKeyDown={this.sendQuery}></input>
                <button onClick={this.resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
            </div>
        )
    }
}

export default MonsterSearchBar;