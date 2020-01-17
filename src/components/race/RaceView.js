import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/race/RaceView.css';
import { saveRace, savePerks, deleteRace, deletePerk, deletePerks, reciveRacePerks, insertNewPerk } from '../../database/RaceService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function RaceView({ race }) {
    const [id, setId] = useState(0);
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

    const receiveRace = (result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveRace")
            setName(result.race_name);
            setSources(result.race_sources);
            setId(result.race_id);
            setPic(result.race_pic);
            setAbilityScoreImprov(result.race_abilityScoreImprov);
            setAge(result.race_age);
            setAlignment(result.race_alignment);
            setSize(result.race_size);
            setLang(result.race_lang);
            setSpeed(result.race_speed);
            if (result.race_pic === null) {
                setPic("");
            }
            console.timeEnd("receiveRace")
        })
    }

    const receivePerksResult = (result) => {
        setPerks(result);
    }

    useEffect(() => {
        reciveRacePerks(id, function (result) {
            receivePerksResult(result);
        })
    }, [id]);

    useEffect(() => {
        receiveRace(race);
    }, [race]);

    const saveRaceAction = (e) => {
        saveRace({ id, name, sources, pic, age, abilityScoreImprov, alignment, size, speed, lang });
        ipcRenderer.send('updateWindow', {
            race_id: id, race_name: name, race_sources: sources, race_pic: pic, race_age: age, race_speed: speed,
            race_abilityScoreImprov: abilityScoreImprov, race_alignment: alignment, race_size: size, race_lang: lang
        });
        savePerks(perks);
    }

    const deleteRaceAction = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                deleteRace({ id, name, sources });
                deletePerks({ id, name })
            }
        });
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
                        <label>Ability Score:<input name="abilityScoreImprov" type="text" value={abilityScoreImprov} onChange={e => setAbilityScoreImprov(e.target.value)} placeholder="Ability score improvement..." /></label>
                        <label className="small">Sources:<input name="sources" type="text" value={sources} onChange={e => setSources(e.target.value)} placeholder="Sources..." /></label>
                        <button onClick={deleteRaceAction} className="delete" style={{ marginRight: "5px", marginLeft: "5px" }}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                        <button onClick={saveRaceAction}><FontAwesomeIcon icon={faSave} /> Save</button>
                    </div>
                    <div className="image" style={style}></div>
                    <button onClick={addNewPerkAction}><FontAwesomeIcon icon={faPlus} /> Add perk</button>
                </div>
                <label>Age:<textarea className="small" name="age" value={age} onChange={e => setAge(e.target.value)} placeholder="Age..."></textarea></label>
                <label>Alignment:<textarea className="small" name="alignment" value={alignment} onChange={e => setAlignment(e.target.value)} placeholder="Alignment..."></textarea></label>
                <label>Size:<textarea className="small" name="size" value={size} onChange={e => setSize(e.target.value)} placeholder="Size..."></textarea></label>
                <label>Speed:<textarea className="small" name="speed" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="Speed..."></textarea></label>
                <label>Language:<textarea className="small" name="language" value={lang} onChange={e => setLang(e.target.value)} placeholder="Language..."></textarea></label>
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
