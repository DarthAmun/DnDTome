import React, { useState } from 'react';
import { saveNewGear } from '../../database/GearService';
import '../../assets/css/gear/GearView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export default function GearView() {
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [damage, setDamage] = useState("");
    const [weight, setWeight] = useState("");
    const [properties, setProperties] = useState("");
    const [type, setType] = useState("");

    const saveGear = (e) => {
        saveNewGear({ name, pic, description, cost, weight, damage, properties, type });
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
            </div>
            <div className="top">
                <label>Weight:<input name="weight" type="weight" value={weight} onChange={e => setWeight(e.target.value)} /></label>
                <label>Damage:<input name="damage" type="damage" value={damage} onChange={e => setDamage(e.target.value)} /></label>
                <label>Cost:<input name="cost" type="text" value={cost} onChange={e => setCost(e.target.value)} /></label>
            </div>
            <label style={{ float: "left", width: "623px" }}>Props:<input style={{ width: "510px", marginRight: "13px" }} name="props" type="text" value={properties} onChange={e => setProperties(e.target.value)} /></label>
            <div style={{ width: "100%", float: "left"}}>
                <div className="image" style={style}></div>
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <button onClick={saveGear}><FontAwesomeIcon icon={faSave} /> Save</button>
        </div>
    )

}
