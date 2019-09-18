import React, { Component } from 'react';
import '../../assets/css/SearchBar.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class SpellSearchBar extends Component {
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
            ipcRenderer.send('sendSearchQuery', { query: this.makeQuery(this.state.query) });
        }
    }
    makeQuery = (value) => {
        let searchQuery = { name: "", time: "", school: "", level: "", duration: "", range: "", component: "", class: "", text: "" }
        let querys = value.split(",");
        querys.map((query, key) => {
            if (query.includes("name[")) {
                let q = query.replace("name[", "");
                q = q.replace("]", "");
                searchQuery.name = q.trim();
            } else if (query.includes("time[")) {
                let q = query.replace("time[", "");
                q = q.replace("]", "");
                searchQuery.time = q.trim();
            } else if (query.includes("school[")) {
                let q = query.replace("school[", "");
                q = q.replace("]", "");
                searchQuery.school = q.trim();
            } else if (query.includes("level[")) {
                let q = query.replace("level[", "");
                q = q.replace("]", "");
                searchQuery.level = q.trim();
            } else if (query.includes("duration[")) {
                let q = query.replace("duration[", "");
                q = q.replace("]", "");
                searchQuery.duration = q.trim();
            } else if (query.includes("range[")) {
                let q = query.replace("range[", "");
                q = q.replace("]", "");
                searchQuery.range = q.trim();
            } else if (query.includes("component[")) {
                let q = query.replace("component[", "");
                q = q.replace("]", "");
                searchQuery.component = q.trim();
            } else if (query.includes("class[")) {
                let q = query.replace("class[", "");
                q = q.replace("]", "");
                searchQuery.classe = q.trim();
            } else if (query.includes("text[")) {
                let q = query.replace("text[", "");
                q = q.replace("]", "");
                searchQuery.text = q.trim();
            }
        });
        return searchQuery;
    }


    render() {
        return (
            <div id="searchBar">
                <input type="text" placeholder="Search like ... name[Fire], time[1 action] ..."
                    onChange={this.changeQuery}
                    onKeyDown={this.sendQuery}></input>
            </div>
        )
    }
}

export default SpellSearchBar;