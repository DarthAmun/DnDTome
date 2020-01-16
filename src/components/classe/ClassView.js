import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/classe/ClassView.css';
import { saveClass, savePerks, deleteClass, deletePerk, reciveClassPerks, insertNewPerk } from '../../database/ClassService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function ClassView({ classe }) {
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

    const receiveClass = (result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveClass")
            setName(result.classe_name);
            setSources(result.classe_sources);
            setId(result.classe_id);
            setPic(result.classe_pic);
            setAbilityScoreImprov(result.classe_abilityScoreImprov);
            setAge(result.classe_age);
            setAlignment(result.classe_alignment);
            setSize(result.classe_size);
            setLang(result.classe_lang);
            setSpeed(result.classe_speed);
            if (result.classe_pic === null) {
                setPic("");
            }
            console.timeEnd("receiveClass")
        })
    }

    const receivePerksResult = (result) => {
        setPerks(result);
    }

    useEffect(() => {
        reciveClassPerks(id, function (result) {
            receivePerksResult(result);
        })
    }, [id]);

    useEffect(() => {
        receiveClass(classe);
    }, [classe]);

    const saveClassAction = (e) => {
        saveClass({ id, name, sources, pic, age, abilityScoreImprov, alignment, size, speed, lang });
        ipcRenderer.send('updateWindow', {
            classe_id: id, classe_name: name, classe_sources: sources, classe_pic: pic, classe_age: age, classe_speed: speed,
            classe_abilityScoreImprov: abilityScoreImprov, classe_alignment: alignment, classe_size: size, classe_lang: lang
        });
        savePerks(perks);
    }

    const deleteClassAction = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                deleteClass({ id, name, sources });
            }
        });
    }

    const addNewPerkAction = (e) => {
        insertNewPerk(id, function (newId) {
            setPerks(perks => [...perks, { perk_title: "", perk_text: "", perk_level: 1, perk_id: newId, classe_id: id }])
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
        <div id="classeView">
            <div className="left">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name..." /></label>
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
