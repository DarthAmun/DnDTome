import React, { Component } from 'react';
import '../../assets/css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class ItemSearchBar extends Component {
    state = {
        query: {
            name: "",
            description: "",
            rarity: "",
            type: "",
            source: ""
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
    changeRarity = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                rarity: event.target.value
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
    changeDescription = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                description: event.target.value
            }
        });
    }
    changeSource = (event) => {
        this.setState({
            ...this.state,
            query: {
                ...this.state.query,
                source: event.target.value
            }
        });
    }

    sendQuery = (e) => {
        if (e.key === 'Enter') {
            ipcRenderer.send('sendItemSearchQuery', { query: this.state.query });
        }
    }

    resetSearch = (e) => {
        this.setState({
            ...this.state,
            query: {
                name: "",
                description: "",
                rarity: "",
                type: "",
                source: ""
            }
        });
        ipcRenderer.send('sendItemSearchQuery', { query: {} });
    }

    render() {
        return (
            <div id="searchBar">
                <input type="text" style={{width: "180px"}} placeholder="Name" value={this.state.query.name} onChange={this.changeName} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "180px"}} placeholder="Rarity" value={this.state.query.rarity} onChange={this.changeRarity} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "180px"}} placeholder="Type" value={this.state.query.type} onChange={this.changeType} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "180px"}} placeholder="Source" value={this.state.query.source} onChange={this.changeSource} onKeyDown={this.sendQuery}></input>
                <input type="text" style={{width: "180px"}} placeholder="Description" value={this.state.query.description} onChange={this.changeDescription} onKeyDown={this.sendQuery}></input>
                <button onClick={this.resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
            </div>
        )
    }
}

export default ItemSearchBar;