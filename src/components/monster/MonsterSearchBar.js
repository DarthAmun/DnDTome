import React, { useState } from 'react';
import '../../assets/css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function MonsterSearchBar() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [cr, setCr] = useState("");
    const [alignment, setAlignment] = useState("");
    const [speed, setSpeed] = useState("");
    const [damage, setDamage] = useState("");
    const [senses, setSenses] = useState("");
    const [ability, setAbility] = useState("");
    const [action, setAction] = useState("");

    function sendQuery(e) {
        if (e.key === 'Enter') {
            ipcRenderer.send('sendMonsterSearchQuery', { query: { name, type, subtype, cr, alignment, speed, damage, senses, ability, action } });
        }
    }

    function resetSearch(e) {
        setName("");
        setSenses("");
        setSpeed("");
        setType("");
        setSubtype("");
        setCr("");
        setAbility("");
        setDamage("");
        setAlignment("");
        setAction("");
        ipcRenderer.send('sendMonsterSearchQuery', { query: {} });
    }

    return (
        <div id="searchBar">
            <input type="text" style={{ width: "180px" }} placeholder="Name" value={name} onChange={e => setName(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Type" value={type} onChange={e => setType(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Subtype" value={subtype} onChange={e => setSubtype(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "20px" }} placeholder="Cr" value={cr} onChange={e => setCr(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Alignment" value={alignment} onChange={e => setAlignment(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Speed" value={speed} onChange={e => setSpeed(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Senses" value={senses} onChange={e => setSenses(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "80px" }} placeholder="Damage" value={damage} onChange={e => setDamage(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Ability" value={ability} onChange={e => setAbility(e.target.value)} onKeyDown={sendQuery}></input>
            <input type="text" style={{ width: "180px" }} placeholder="Action" value={action} onChange={e => setAction(e.target.value)} onKeyDown={sendQuery}></input>
            <button onClick={resetSearch}><FontAwesomeIcon icon={faUndo} /> Reset</button>
        </div>
    )

}
