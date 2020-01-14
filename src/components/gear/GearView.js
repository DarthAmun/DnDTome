import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/gear/GearView.css';
import { saveGear, deleteGear, addGearToChar } from '../../database/GearService';
import { reciveAllChars } from '../../database/CharacterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function GearView({ gear }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [damage, setDamage] = useState("");
    const [weight, setWeight] = useState("");
    const [properties, setProperties] = useState("");
    const [type, setType] = useState("");
    const [sources, setSources] = useState("");

    const [chars, setChars] = useState([]);
    const [selectedChar, setSelectedChar] = useState(0);

    const receiveGear = (result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveGear")
            let text = "";
            if (result.gear_description !== null && result.gear_description !== undefined) {
                text = result.gear_description.replace(/\\n/gm, "\r\n");
            }
            setName(result.gear_name);
            setId(result.gear_id);
            setDescription(text);
            setPic(result.gear_pic);
            setCost(result.gear_cost);
            setDamage(result.gear_damage);
            setWeight(result.gear_weight);
            setProperties(result.gear_properties);
            setType(result.gear_type);
            setSources(result.gear_sources);
            console.timeEnd("receiveGear")
        })
    }

    const receiveChars = (result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveChars")
            setChars(result);
            setSelectedChar(result[0].char_id);
            console.timeEnd("receiveChars")
        })
    }

    useEffect(() => {
        reciveAllChars(function (result) {
            receiveChars(result)
        })
    }, [id]);

    useEffect(() => {
        receiveGear(gear);
    }, [gear]);

    const saveGearAction = (e) => {
        saveGear({ id, name, pic, description, cost, weight, damage, properties, type, sources });
        ipcRenderer.send('updateWindow', {
            gear_id: id, gear_name: name, gear_pic: pic, gear_description: description,
            gear_cost: cost, gear_weight: weight, gear_damage: damage, gear_properties: properties, 
            gear_type: type, gear_sources: sources
        });
    }

    const addGearToCharAction = (e) => {
        addGearToChar({ selectedChar }, { id, name, damage, properties }, function () { });
    }

    const deleteGearAction = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                deleteGear({ id, name, pic, description, cost, weight, damage, properties });
            }
        });
    }

    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div id="gearView">
            <div className="top">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label>
                <label>Type:<input name="type" type="text" value={type} onChange={e => setType(e.target.value)} /></label>
                <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                <label>Props:<input name="props" type="text" value={properties} onChange={e => setProperties(e.target.value)} /></label>
                <label className="left">Char:<select value={selectedChar} onChange={e => setSelectedChar(e.target.value)}>
                    {chars.map((char, index) => {
                        return <option key={index} value={char.char_id}>{char.char_name}</option>;
                    })}
                </select></label>
            </div>
            <div className="top">
                <label>Weight:<input name="weight" type="weight" value={weight} onChange={e => setWeight(e.target.value)} /></label>
                <label>Damage:<input name="damage" type="damage" value={damage} onChange={e => setDamage(e.target.value)} /></label>
                <label>Sources:<input name="sources" type="text" value={sources} onChange={e => setSources(e.target.value)} /></label>
                <label>Cost:<input name="cost" type="text" value={cost} onChange={e => setCost(e.target.value)} /></label>
                <button onClick={addGearToCharAction} style={{ float: "left" }}><FontAwesomeIcon icon={faPlus} /> Add to char</button>
                <button className="delete" onClick={deleteGearAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={saveGearAction}><FontAwesomeIcon icon={faSave} /> Save</button>
            </div>
            <div className="image" style={style}></div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
    )

}
