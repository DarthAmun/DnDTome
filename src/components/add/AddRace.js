import React, { useState, useEffect } from 'react';
import '../../assets/css/race/RaceView.css';
import { saveNewRace, savePerks, deletePerk, insertNewPerk } from '../../database/RaceService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function RaceView() {
    const [name, setName] = useState("");
    const [sources, setSources] = useState("");
    const [pic, setPic] = useState("");
    const [abilityScoreImprov, setAbilityScoreImprov] = useState("");
    const [age, setAge] = useState("");
    const [alignment, setAlignment] = useState("");
    const [size, setSize] = useState("");
    const [speed, setSpeed] = useState("");
    const [lang, setLang] = useState("");
    const [perks, setPerks] = useState([]);

    const saveRaceAction = (e) => {
        saveNewRace({ name, sources, pic, age, abilityScoreImprov, alignment, size, speed, lang });
        savePerks(perks);
    }

    const addNewPerkAction = (e) => {
        insertNewPerk(id, function (newId) {
            setPerks(perks => [...perks, { perk_title: "", perk_text: "", perk_level: 1, perk_id: newId, race_id: id }])
        });
    }
    const deletePerkAction = (id) => {
        deletePerk(id, function () {
            let perkList = perks.filter(perk => perk.perk_id !== id);
            setPerks(perkList);
        })
    }

    const setPerkTitle = (e, id) => {
        let part = perks.map(perk => {
            if (perk.perk_id === id) { return { ...perk, perk_title: e.target.value }; } else { return perk; }
        });
        setPerks(part);
    }
    const setPerkLevel = (e, id) => {
        let part = perks.map(perk => {
            if (perk.perk_id === id) { return { ...perk, perk_level: e.target.value }; } else { return perk; }
        });
        setPerks(part);
    }
    const setPerkText = (e, id) => {
        let part = perks.map(perk => {
            if (perk.perk_id === id) { return { ...perk, perk_text: e.target.value }; } else { return perk; }
        });
        setPerks(part);
    }

    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div id="raceView">
            <div className="left">
                <div className="topPart">
                    <div className="top">
                        <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name..." /></label>
                        <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                        <label>Sources:<input name="sources" type="text" value={sources} onChange={e => setSources(e.target.value)} placeholder="Sources..." /></label>
                        <label>Ability Score:<input name="abilityScoreImprov" type="text" value={abilityScoreImprov} onChange={e => setAbilityScoreImprov(e.target.value)} placeholder="Ability score improvement..." /></label>
                    </div>
                    <div className="image" style={style}></div>
                    <button onClick={saveRaceAction}><FontAwesomeIcon icon={faSave} /> Save</button>
                </div>
                <label>Age:<textarea className="small" name="age" value={age} onChange={e => setAge(e.target.value)} placeholder="Age..."></textarea></label>
                <label>Alignment:<textarea className="small" name="alignment" value={alignment} onChange={e => setAlignment(e.target.value)} placeholder="Alignment..."></textarea></label>
                <label>Size:<textarea className="small" name="size" value={size} onChange={e => setSize(e.target.value)} placeholder="Size..."></textarea></label>
                <label>Speed:<textarea className="small" name="speed" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="Speed..."></textarea></label>
                <label>Language:<textarea className="small" name="language" value={lang} onChange={e => setLang(e.target.value)} placeholder="Language..."></textarea></label>
                <button onClick={addNewPerkAction} style={{ float: "right" }}><FontAwesomeIcon icon={faPlus} /> Add perk</button>
            </div>
            <div className="right">
                {perks.map((perk, index) => {
                    return <div className="perk" key={perk.perk_id}>
                        <input className="perkTitle" type="text" value={perk.perk_title} onChange={e => setPerkTitle(e, perk.perk_id)} placeholder="Perk title..."></input>
                        <input className="perkLevel" type="number" value={perk.perk_level} onChange={e => setPerkLevel(e, perk.perk_id)} placeholder="Perk level..."></input>
                        <button onClick={e => deletePerkAction(perk.perk_id)} className="delete" style={{ float: "right" }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                        <textarea className="perkText" value={perk.perk_text} onChange={e => setPerkText(e, perk.perk_id)} placeholder="Perk text..."></textarea>
                    </div>;
                })}
            </div>
        </div>
    )
}
