import React, { useState, useEffect } from 'react';
import '../../assets/css/item/ItemView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function ItemView() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [description, setDescription] = useState("");
    const [rarity, setRarity] = useState("");
    const [type, setType] = useState("");
    const [source, setSource] = useState("");

    const receiveItem = (event, result) => {
        const text = result.item_description.replace(/\\n/gm, "\r\n");
        setName(result.item_name);
        setId(result.item_id);
        setDescription(text);
        setPic(result.item_pic);
        setRarity(result.item_rarity);
        setType(result.item_type);
        setSource(result.item_source);
    }

    useEffect(() => {
        ipcRenderer.on("onViewItem", receiveItem);
        return () => {
            ipcRenderer.removeListener("onViewItem", receiveItem);
        }
    }, []);

    const saveItem = (e) => {
        ipcRenderer.send('saveItem', { item: { id, name, pic, type, rarity, source, description } });
    }

    const deleteItem = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                ipcRenderer.send('deleteItem', { item: { id, name, pic, type, rarity, source, description } });
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
            </div>
            <div className="top">
                <label>Rarity:<input name="rarity" type="text" value={rarity} onChange={e => setRarity(e.target.value)} /></label>
                <label>Type:<input name="type" type="text" value={type} onChange={e => setType(e.target.value)} /></label>
                <button className="delete" onClick={deleteItem}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={saveItem}><FontAwesomeIcon icon={faSave} /> Save</button>
            </div>
            <div className="image" style={style}></div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
    )

}
