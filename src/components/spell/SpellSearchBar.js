import React, { useState } from 'react';
import '../../assets/css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellSearchBar() {
    const [name, setName] = useState("");
    const [school, setSchool] = useState("");
    const [level, setLevel] = useState("");
    const [time, setTime] = useState("");
    const [range, setRange] = useState("");
    const [duration, setDuration] = useState("");
    const [components, setComponents] = useState("");
    const [text, setText] = useState("");
    const [classes, setClasses] = useState("");
    const [sources, setSources] = useState("");

    function sendQuery(e) {
        if (e.key === 'Enter') {
            ipcRenderer.send('sendSpellSearchQuery', { query: {name, school, level, time, range, duration, components, text, classes, sources} });
        }
    }

    function resetSearch(e) {
        setName("");
        setSchool("");
        setLevel("");
        setTime("");
        setRange("");
        setDuration("");
        setComponents("");
        setText("");
        setClasses("");
        setSources("");
        ipcRenderer.send('sendSpellSearchQuery', { query: {} });
    }

    return (
        <div id="searchBar">
            <input type="text" style={{ width: "180px" }} placeholder="Name" value={name} onChange={e => setName(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="School" value={school} onChange={e => setSchool(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "40px" }} placeholder="Level" value={level} onChange={e => setLevel(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Casting Time" value={time} onChange={e => setTime(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Range" value={range} onChange={e => setRange(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Components" value={components} onChange={e => setComponents(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Classes" value={classes} onChange={e => setClasses(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Text" value={text} onChange={e => setText(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Sources" value={sources} onChange={e => setSources(e.target.value)} onKeyDown={sendQuery}></input>
            <button onClick={resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
        </div>
    )

}