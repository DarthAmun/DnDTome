import React, { useState } from 'react';
import '../../assets/css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function ItemSearchBar() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rarity, setRarity] = useState("");
    const [type, setType] = useState("");
    const [source, setSource] = useState("");

    function sendQuery(e) {
        if (e.key === 'Enter') {
            ipcRenderer.send('sendItemSearchQuery', { query: { name, description, rarity, type, source } });
        }
    }

    function resetSearch(e) {
        setType("");
        setSource("");
        setName("");
        setRarity("");
        setDescription("");
        ipcRenderer.send('sendItemSearchQuery', { query: {} });
    }

    return (
        <div id="searchBar">
            <input type="text" style={{ width: "180px" }} placeholder="Name" value={name} onChange={e => setName(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Rarity" value={rarity} onChange={e => setRarity(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Type" value={type} onChange={e => setType(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Source" value={source} onChange={e => setSource(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} onKeyDown={sendQuery}></input>
            <button onClick={resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
        </div>
    )
}

