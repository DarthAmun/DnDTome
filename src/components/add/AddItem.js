import React, { useState } from 'react';
import { saveNewItem } from '../../database/ItemService';
import '../../assets/css/item/ItemView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export default function AddItem() {
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [description, setDescription] = useState("");
    const [rarity, setRarity] = useState("");
    const [type, setType] = useState("");
    const [source, setSource] = useState("");
    const [attunment, setAttunment] = useState("");

    const saveItemAction = (e) => {
        saveNewItem({ name, pic, type, rarity, source, attunment, description });
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
                <label className="checkbox-label">
                    <div className="labelText">Attuned:</div>
                    <input name="type" type="checkbox" checked={attunment} onChange={e => setAttunment(e.target.checked)} />
                    <span className="checkbox-custom circular"></span>
                </label>
            </div>
            <div className="top" style={{ width: "120px" }}>
                <button onClick={saveItemAction}><FontAwesomeIcon icon={faSave} /> Save</button>

            </div>
            <div className="image" style={style}></div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
    )

}
