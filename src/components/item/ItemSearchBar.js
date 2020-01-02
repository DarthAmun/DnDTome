import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/SearchBar.css';
import { reciveAttributeSelection } from '../../database/ItemService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import Select from 'react-select';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function ItemSearchBar() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rarity, setRarity] = useState("");
    const [rarityList, setRarityList] = useState([]);
    const [type, setType] = useState("");
    const [typeList, setTypeList] = useState([]);
    const [source, setSource] = useState("");
    const [attunment, setAttunment] = useState("");

    useEffect(() => {
        reciveAttributeSelection("rarity", function (result) {
            let rarities = result.map(rarity => {
                if(rarity.item_rarity === "") {
                    return { value: rarity.item_rarity, label: "Empty" };
                }
                return { value: rarity.item_rarity, label: rarity.item_rarity };
            })
            setRarityList(rarities);
        })
        reciveAttributeSelection("type", function (result) {
            let types = result.map(type => {
                if(type.item_type === "") {
                    return { value: type.item_type, label: "Empty" };
                }
                return { value: type.item_type, label: type.item_type };
            })
            setTypeList(types);
        })
    }, []);

    useEffect(() => {
        ipcRenderer.send("sendItemSearchQuery", { query: { name, type, rarity, source, attunment, description } });
    }, [name, type, rarity, source, attunment, description]);

    const resetSearch = () => {
        ReactDOM.unstable_batchedUpdates(() => {
            setName("");
            setDescription("");
            setRarity("");
            setType("");
            setSource("");
            setAttunment("");
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
            <label className="smaller left checkbox-label" style={{width: '110px'}}>
                <div className="labelText" style={{width: '110px'}}>Attunment:</div>
                <input name="ritual" type="checkbox" checked={attunment} onChange={e => setAttunment(e.target.checked)} />
                <span className="checkbox-custom circular" style={{left: '95px'}}></span>
            </label>
            <input type="text" name={name} placeholder="Name..." value={name} onChange={e => setName(e.target.value)} />
            <Select
                value={rarity}
                onChange={rarity => setRarity(rarity)}
                options={rarityList}
                isMulti={true}
                styles={customStyles}
                placeholder="Rarity..."
            />
            <Select
                value={type}
                onChange={type => setType(type)}
                options={typeList}
                isMulti={true}
                styles={customStyles}
                placeholder="Type..."
            />
            <input type="text" name={description} placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} />
            <input type="text" name={source} placeholder="Source..." value={source} onChange={e => setSource(e.target.value)} />
            <button onClick={resetSearch}>
                <FontAwesomeIcon icon={faUndo} /> Reset
            </button>
        </div>
    );
}