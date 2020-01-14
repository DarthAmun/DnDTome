import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/item/ItemView.css';
import OptionService from '../../database/OptionService';
import ThemeService from '../../services/ThemeService';
import { saveItem, deleteItem, addItemToChar } from '../../database/ItemService';
import { reciveAllChars } from '../../database/CharacterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function ItemView({ item }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [description, setDescription] = useState("");
    const [rarity, setRarity] = useState("");
    const [type, setType] = useState("");
    const [source, setSource] = useState("");
    const [attunment, setAttunment] = useState("");

    const [chars, setChars] = useState([]);
    const [selectedChar, setSelectedChar] = useState(0);

    const receiveItem = (result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveItem")
            let text = "";
            if (result.item_description !== null) {
                text = result.item_description.replace(/\\n/gm, "\r\n");
            }
            setName(result.item_name);
            setId(result.item_id);
            setDescription(text);
            setPic(result.item_pic);
            setRarity(result.item_rarity);
            setType(result.item_type);
            setSource(result.item_source);
            setAttunment(result.item_attunment);
            console.timeEnd("receiveItem")
        })
    }

    const receiveChars = (result) => {
        setChars(result);
        setSelectedChar(result[0].char_id);
    }

    useEffect(() => {
        reciveAllChars(function (result) {
            receiveChars(result)
        })
    }, [id]);

    useEffect(() => {
        receiveItem(item);
    }, [item]);

    const saveItemAction = (e) => {
        saveItem({ id, name, pic, type, rarity, source, attunment, description });
        ipcRenderer.send('updateWindow', {
            item_id: id, item_name: name, item_pic: pic, item_type: type, item_rarity: rarity,
            item_source: source, item_attunment: attunment, item_description: description
        });
    }

    const addItemToCharAction = (e) => {
        addItemToChar({ selectedChar }, { id, name }, function () { });
    }

    const deleteItemAction = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                deleteItem({ id, name, pic, type, rarity, source, description });
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
        <div id="itemView">
            <div className="top">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label>
                <label>Sources:<input name="source" type="text" value={source} onChange={e => setSource(e.target.value)} /></label>
                <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                <label className="left">Char:<select value={selectedChar} onChange={e => setSelectedChar(e.target.value)}>
                    {chars.map((char, index) => {
                        return <option key={index} value={char.char_id}>{char.char_name}</option>;
                    })}
                </select></label>
            </div>
            <div className="top">
                <label>Rarity:<input name="rarity" type="text" value={rarity} onChange={e => setRarity(e.target.value)} /></label>
                <label>Type:<input name="type" type="text" value={type} onChange={e => setType(e.target.value)} /></label>
                <label className="checkbox-label">
                    <div className="labelText">Attuned:</div>
                    <input name="type" type="checkbox" checked={attunment} onChange={e => setAttunment(e.target.checked)} />
                    <span className="checkbox-custom circular"></span>
                </label>
                <button onClick={addItemToCharAction}><FontAwesomeIcon icon={faPlus} /> Add to char</button>
            </div>
            <div className="top" style={{ width: "120px" }}>
                <button className="delete" onClick={deleteItemAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={saveItemAction}><FontAwesomeIcon icon={faSave} /> Save</button>
            </div>

            <div className="top" style={{ width: "100%" }}>
                <div className="image" style={style}></div>
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
        </div>
    )

}
