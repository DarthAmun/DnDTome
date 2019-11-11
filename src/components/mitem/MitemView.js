import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/mitem/MitemView.css';
import OptionService from '../../database/OptionService';
import ThemeService from '../../services/ThemeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function MitemView() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [damage, setDamage] = useState("");
    const [weight, setWeight] = useState("");
    const [properties, setProperties] = useState("");

    const [chars, setChars] = useState([]);
    const [selectedChar, setSelectedChar] = useState(0);

    const receiveMitem = (event, result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveMitem")
            const text = result.mitem_description.replace(/\\n/gm, "\r\n");
            setName(result.mitem_name);
            setId(result.mitem_id);
            setDescription(text);
            setPic(result.mitem_pic);
            setCost(result.mitem_cost);
            setDamage(result.mitem_damage);
            setWeight(result.mitem_weight);
            setProperties(result.mitem_properties);
            console.timeEnd("receiveMitem")
        })
    }

    const receiveChars = (event, result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveChars")
            setChars(result);
            setSelectedChar(result[0].char_id);
            console.timeEnd("receiveChars")
        })
    }

    useEffect(() => {
        OptionService.get('theme', function (result) {
            ThemeService.setTheme(result);
            ThemeService.applyTheme(result);
        });
        ipcRenderer.on("onViewMitem", receiveMitem);
        ipcRenderer.send('getChars');
        ipcRenderer.on("getCharsResult", receiveChars);
        return () => {
            ipcRenderer.removeListener("onViewMitem", receiveMitem);
            ipcRenderer.removeListener("getCharsResult", receiveChars);
        }
    }, []);

    const saveMitem = (e) => {
        console.log("save trigger");
        ipcRenderer.send('saveMitem', { mitem: { id, name, pic, description, cost, weight, damage, properties } });
    }

    const addMitemToChar = (e) => {
        ipcRenderer.send('addMitemToChar', { char: { selectedChar }, mitem: { id, name } });
    }

    const deleteMitem = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                ipcRenderer.send('deleteMitem', { mitem: { id, name, pic, description, cost, weight, damage, properties} });
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
        <div id="mitemView">
            <div className="top">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label>
                <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                <label>Cost:<input name="cost" type="text" value={cost} onChange={e => setCost(e.target.value)} /></label>
                <label className="left">Char:<select value={selectedChar} onChange={e => setSelectedChar(e.target.value)}>
                    {chars.map((char, index) => {
                        return <option key={index} value={char.char_id}>{char.char_name}</option>;
                    })}
                </select></label>
            </div>
            <div className="top">
                <label>Weight:<input name="weight" type="weight" value={weight} onChange={e => setWeight(e.target.value)} /></label>
                <label>Damage:<input name="damage" type="damage" value={damage} onChange={e => setDamage(e.target.value)} /></label>
                <label>Props:<input name="props" type="text" value={properties} onChange={e => setProperties(e.target.value)} /></label>
                <button onClick={addMitemToChar} style={{float: "left"}}><FontAwesomeIcon icon={faPlus} /> Add to char</button>
            </div>
            <div className="image" style={style}></div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <button className="delete" onClick={deleteMitem}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
            <button onClick={saveMitem}><FontAwesomeIcon icon={faSave} /> Save</button>
        </div>
    )

}
