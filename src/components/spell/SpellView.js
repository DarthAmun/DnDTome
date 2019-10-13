import React, { useState, useEffect } from 'react';
import '../../assets/css/spell/SpellView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function SpellView() {
    const [id, setId] = useState("");
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

    const receiveSpell = (event, result) => {
        const text = result.spell_text.replace(/\\n/gm, "\r\n");
        const sources = result.spell_sources.replace(/\\n/gm, "\r\n");

        setName(result.spell_name);
        setSchool(result.spell_school);
        setLevel(result.spell_level);
        setTime(result.spell_time);
        setRange(result.spell_range);
        setDuration(result.spell_duration);
        setComponents(result.spell_components);
        setText(text);
        setClasses(result.spell_classes);
        setSources(sources);
        setId(result.spell_id);
    }

    useEffect(() => {
        ipcRenderer.on("onViewSpell", receiveSpell);
        return () => {
            ipcRenderer.removeListener("onViewSpell", receiveSpell);
        }
    }, []);

    const saveSpell = (e) => {
        ipcRenderer.send('saveSpell', { spell: { id, name, school, level, time, range, duration, components, text, classes, sources } });
    }

    const addSpellToChar = (e) => {

    }

    const deleteSpell = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                ipcRenderer.send('deleteSpell', { spell: { id, name, school, level, time, range, duration, components, text, classes, sources } });
            }
        });
    }

    return (
        <div id="spellView">
            <div className="top">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name..." /></label>
                <label>School:<input name="school" type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="School..." /></label>
                <label>Level:<input name="level" type="number" value={level} onChange={e => setLevel(e.target.value)} /></label>
                <label>Casting Time:<input name="time" type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="Casting Time..." /></label>
                <label>Range:<input name="range" type="text" value={range} onChange={e => setRange(e.target.value)} placeholder="Range..." /></label>
                <label>Duration:<input name="duration" type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration..." /></label>
                <label>Components:<input name="components" type="text" value={components} onChange={e => setComponents(e.target.value)} placeholder="Components..." /></label>
                <label>Classes:<input name="classes" type="text" value={classes} onChange={e => setClasses(e.target.value)} placeholder="Classes..." /></label>
                <label>Sources:<input name="sources" type="text" value={sources} onChange={e => setSources(e.target.value)} placeholder="Sources..." /></label>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Describtion..."></textarea>
            <button className="delete" onClick={deleteSpell}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
            <button onClick={saveSpell}><FontAwesomeIcon icon={faSave} /> Save</button>
            {/* <button onClick={addSpellToChar}><FontAwesomeIcon icon={faPlus} /> Add to char</button> */}
        </div>
    )
}
