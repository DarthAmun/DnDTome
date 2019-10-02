import React, { Component } from 'react';
import '../../assets/css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class MonsterSearchBar extends Component {
    state = {
        query: {
            name: ""
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

    sendQuery = (e) => {
        if (e.key === 'Enter') {
            ipcRenderer.send('sendMonsterSearchQuery', { query: this.state.query });
        }
    }

    resetSearch = (e) => {
        this.setState({
            ...this.state,
            query: {
                name: ""
            }
        });
        ipcRenderer.send('sendMonsterSearchQuery', { query: {} });
    }

    render() {
        return (
            <div id="searchBar">
                <input type="text" style={{width: "180px"}} placeholder="Name" value={this.state.query.name} onChange={this.changeName} onKeyDown={this.sendQuery}></input>
                <button onClick={this.resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
            </div>
        )
    }
}

export default MonsterSearchBar;