import React, { useState } from 'react';
import { saveNewSpell } from '../../database/SpellService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/spell/SpellView.css';

export default function AddSpell() {
    const [name, setName] = useState("");
    const [school, setSchool] = useState("");
    const [level, setLevel] = useState(0);
    const [ritual, setRitual] = useState(0);
    const [time, setTime] = useState("");
    const [range, setRange] = useState("");
    const [duration, setDuration] = useState("");
    const [components, setComponents] = useState("");
    const [text, setText] = useState("");
    const [classes, setClasses] = useState("");
    const [sources, setSources] = useState("");

    const saveSpell = (e) => {
        saveNewSpell({ name, school, level, ritual, time, range, duration, components, text, classes, sources });
    }

    return (
        <div id="overview">
            <div id="spellView">
                <div className="top">
                    <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label>
                    <label>School:<input name="school" type="text" value={school} onChange={e => setSchool(e.target.value)} /></label>
                    <label>Level:<input name="level" type="number" value={level} onChange={e => setLevel(e.target.value)} /></label>
                    <label className="checkbox-label">
                        <div className="labelText">Ritual:</div>
                        <input name="ritual" type="checkbox" checked={ritual} onChange={e => setRitual(e.target.checked)} />
                        <span className="checkbox-custom circular"></span>
                    </label>
                    <label>Casting Time:<input name="time" type="text" value={time} onChange={e => setTime(e.target.value)} /></label>
                    <label>Range:<input name="range" type="text" value={range} onChange={e => setRange(e.target.value)} /></label>
                    <label>Duration:<input name="duration" type="text" value={duration} onChange={e => setDuration(e.target.value)} /></label>
                    <label>Components:<input name="components" type="text" value={components} onChange={e => setComponents(e.target.value)} /></label>
                    <label>Classes:<input name="classes" type="text" value={classes} onChange={e => setClasses(e.target.value)} /></label>
                    <label>Sources:<input name="sources" type="text" value={sources} onChange={e => setSources(e.target.value)} /></label>
                </div>
                <textarea value={text} onChange={e => setText(e.target.value)}></textarea>
                <button onClick={saveSpell}><FontAwesomeIcon icon={faSave} /> Save</button>
            </div>
        </div>
    );
}
