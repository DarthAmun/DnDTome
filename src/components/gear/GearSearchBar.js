import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/SearchBar.css';
import { reciveAttributeSelection } from '../../database/GearService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import Select from 'react-select';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function GearSearchBar() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [damage, setDamage] = useState("");
    const [weight, setWeight] = useState("");
    const [properties, setProperties] = useState("");
    const [type, setType] = useState("");
    const [typeList, setTypeList] = useState([]);

    useEffect(() => {
        reciveAttributeSelection("type", function (result) {
            let types = result.map(type => {
                if(type.gear_type === "") {
                    return { value: type.gear_type, label: "Empty" };
                }
                return { value: type.gear_type, label: type.gear_type };
            })
            setTypeList(types);
        })
    }, []);

    useEffect(() => {
        ipcRenderer.send("sendGearSearchQuery", { query: { name, description, cost, weight, damage, properties, type } });
    }, [name, description, cost, weight, damage, properties, type]);

    const resetSearch = () => {
        ReactDOM.unstable_batchedUpdates(() => {
            setName("");
            setDescription("");
            setCost("");
            setDamage("");
            setWeight("");
            setProperties("");
            setType("");
        });
    };

    const customStyles = {
        container: (provided) => ({
            ...provided,
            minWidth: 130,
            float: 'left',
            margin: 5,
        }),
        control: (provided) => ({
            ...provided,
            minWidth: 130,
            height: 40,
            border: 'none',
            boxShadow: 'var(--boxshadow)',
            backgroundColor: 'var(--pagination-input-background-color)',
        }),
        input: (provided) => ({
            ...provided,
            color: 'var(--pagination-input-color)',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--pagination-input-background-color)',
            zIndex: 10000,
        }),
    }

    return (
        <div id="searchBar">
            <input type="text" name={name} placeholder="Name..." value={name} onChange={e => setName(e.target.value)} />
            <Select
                value={type}
                onChange={type => setType(type)}
                options={typeList}
                isMulti={true}
                styles={customStyles}
                placeholder="Type..."
            />
            <input type="text" name={weight} placeholder="Weight..." value={weight} onChange={e => setWeight(e.target.value)} />
            <input type="text" name={damage} placeholder="Damage..." value={damage} onChange={e => setDamage(e.target.value)} />
            <input type="text" name={properties} placeholder="Properties..." value={properties} onChange={e => setProperties(e.target.value)} />
            <input type="text" name={description} placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} />
            <button onClick={resetSearch}>
                <FontAwesomeIcon icon={faUndo} /> Reset
            </button>
        </div>
    );
}