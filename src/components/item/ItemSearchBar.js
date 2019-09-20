import React, { Component } from 'react';
import '../../assets/css/SearchBar.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class ItemSearchBar extends Component {
    state = {
        query: ""
    }

    changeQuery = (event) => {
        this.setState({
            query: event.target.value
        });
    }
    sendQuery = (e) => {
        if (e.key === 'Enter') {
            let query = this.state.query;
            query = this.makeQuery(query);
            ipcRenderer.send('sendItemSearchQuery', { query: this.makeQuery(this.state.query) });
        }
    }
    makeQuery = (value) => {
        let searchQuery = { name: "", description: "", rarity: "", type: "" }
        let querys = value.split(",");
        querys.map((query, key) => {
            if (query.includes("name[")) {
                let q = query.replace("name[", "");
                q = q.replace("]", "");
                searchQuery.name = q.trim();
            } else if (query.includes("desc[")) {
                let q = query.replace("desc[", "");
                q = q.replace("]", "");
                searchQuery.description = q.trim();
            } else if (query.includes("rarity[")) {
                let q = query.replace("rarity[", "");
                q = q.replace("]", "");
                searchQuery.rarity = q.trim();
            } else if (query.includes("type[")) {
                let q = query.replace("type[", "");
                q = q.replace("]", "");
                searchQuery.type = q.trim();
            } 
        });
        return searchQuery;
    }


    render() {
        return (
            <div id="searchBar">
                <input type="text" placeholder="Search like ... name[Fire], desc[1 action] ..."
                    onChange={this.changeQuery}
                    onKeyDown={this.sendQuery}></input>
            </div>
        )
    }
}

export default ItemSearchBar;