import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/SearchBar.css';
import { reciveAttributeSelection } from '../../database/MonsterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import Select from 'react-select';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function MonsterSearchBar() {
    const [name, setName] = useState("");
    const [size, setSize] = useState("");
    const [sizeList, setSizeList] = useState([]);
    const [type, setType] = useState("");
    const [typeList, setTypeList] = useState([]);
    const [subtype, setSubtype] = useState("");
    const [subtypeList, setSubtypeList] = useState([]);
    const [alignment, setAlignment] = useState("");
    const [armorClass, setArmorClass] = useState("");
    const [armorClassList, setArmorClassList] = useState([]);
    const [cr, setCr] = useState("");
    const [crList, setCrList] = useState([]);
    const [source, setSource] = useState("");
    const [savingThrows, setSavingThrows] = useState("");
    const [senses, setSenses] = useState("");
    const [speed, setSpeed] = useState("");
    const [damage, setDamage] = useState("");
    const [action, setAction] = useState("");

    useEffect(() => {
        reciveAttributeSelection("type", function (result) {
            let types = result.map(type => {
                if (type.monster_type === "") {
                    return { value: type.monster_type, label: "Empty" };
                }
                return { value: type.monster_type, label: type.monster_type };
            })
            setTypeList(types);
        })
        reciveAttributeSelection("subtype", function (result) {
            let subtypes = result.map(subtype => {
                if (subtype.monster_subtype === "") {
                    return { value: subtype.monster_subtype, label: "Empty" };
                }
                return { value: subtype.monster_subtype, label: subtype.monster_subtype };
            })
            setSubtypeList(subtypes);
        })
        reciveAttributeSelection("armorClass", function (result) {
            let armorClasss = result.map(armorClass => {
                if (armorClass.monster_armorClass === "") {
                    return { value: armorClass.monster_armorClass, label: "Empty" };
                }
                return { value: armorClass.monster_armorClass, label: armorClass.monster_armorClass };
            })
            setArmorClassList(armorClasss);
            console.log(armorClasss)
        })
        reciveAttributeSelection("cr", function (result) {
            let crs = result.map(cr => {
                if (cr.monster_cr === "") {
                    return { value: cr.monster_cr, label: "Empty" };
                }
                return { value: cr.monster_cr, label: cr.monster_cr };
            })
            setCrList(crs);
            console.log(crs)
        })
        reciveAttributeSelection("size", function (result) {
            let sizes = result.map(size => {
                if (size.monster_size === "") {
                    return { value: size.monster_size, label: "Empty" };
                }
                return { value: size.monster_size, label: size.monster_size };
            })
            setSizeList(sizes);
            console.log(sizes)
        })
    }, []);

    useEffect(() => {
        ipcRenderer.send("sendMonsterSearchQuery", {
            query: {
                name, type, subtype, cr, armorClass, action,
                senses, speed, source, savingThrows, damage, size, alignment
            }
        });
    }, [name, type, subtype, cr, armorClass, action,
        senses, speed, source, savingThrows, damage, size, alignment]);

    const resetSearch = () => {
        ReactDOM.unstable_batchedUpdates(() => {
            setName("");
            setType("");
            setSubtype("");
            setSize("");
            setType("");
            setAlignment("");
            setArmorClass("");
            setCr("");
            setSource("");
            setSavingThrows("");
            setSenses("");
            setSpeed("");
            setDamage("");
            setAction("");
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
            <Select
                value={subtype}
                onChange={subtype => setSubtype(subtype)}
                options={subtypeList}
                isMulti={true}
                styles={customStyles}
                placeholder="Subtype..."
            />
            <Select
                value={armorClass}
                onChange={armorClass => setArmorClass(armorClass)}
                options={armorClassList}
                isMulti={true}
                styles={customStyles}
                placeholder="AC..."
            />
            <Select
                value={cr}
                onChange={cr => setCr(cr)}
                options={crList}
                isMulti={true}
                styles={customStyles}
                placeholder="CR..."
            />
            <Select
                value={size}
                onChange={size => setSize(size)}
                options={sizeList}
                isMulti={true}
                styles={customStyles}
                placeholder="Size..."
            />
            <input type="text" name={alignment} placeholder="Alignment..." value={alignment} onChange={e => setAlignment(e.target.value)} />
            <input type="text" name={source} placeholder="Source..." value={source} onChange={e => setSource(e.target.value)} />
            <input type="text" name={savingThrows} placeholder="Saving throws..." value={savingThrows} onChange={e => setSavingThrows(e.target.value)} />
            <input type="text" name={senses} placeholder="Senses..." value={senses} onChange={e => setSenses(e.target.value)} />
            <input type="text" name={speed} placeholder="Speed..." value={speed} onChange={e => setSpeed(e.target.value)} />
            <input type="text" name={damage} placeholder="Damages..." value={damage} onChange={e => setDamage(e.target.value)} />
            <input type="text" name={action} placeholder="Action..." value={action} onChange={e => setAction(e.target.value)} />
            <button onClick={resetSearch}>
                <FontAwesomeIcon icon={faUndo} /> Reset
            </button>
        </div>
    );
}