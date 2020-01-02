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
    const [type, setType] = useState("");
    const [typeList, setTypeList] = useState([]);
    const [subtype, setSubtype] = useState("");
    const [subtypeList, setSubtypeList] = useState([]);
    const [alignment, setAlignment] = useState("");
    const [ac, setAc] = useState("");
    const [speed, setSpeed] = useState("");
    const [cr, setCr] = useState("");
    const [source, setSource] = useState("");
    const [savingThrows, setSavingThrows] = useState("");
    const [skills, setSkills] = useState("");
    const [senses, setSenses] = useState("");
    const [lang, setLang] = useState("");
    const [dmgVulnerabilitie, setDmgVulnerabilitie] = useState("");
    const [dmgResistance, setDmgResistance] = useState("");
    const [dmgImmunities, setDmgImmunities] = useState("");
    const [conImmunities, setConImmunities] = useState("");
    const [sAblt, setSAblt] = useState("");
    const [ablt, setAblt] = useState("");
    const [lAblt, setLAblt] = useState("");

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
    }, []);

    useEffect(() => {
        ipcRenderer.send("sendMonsterSearchQuery", {
            query: {
                name, type, subtype, cr, ac,
                senses, lang, speed, source, skills, savingThrows, dmgImmunities, dmgResistance,
                dmgVulnerabilitie, conImmunities, sAblt, ablt, lAblt, size, alignment
            }
        });
    }, [name, type, subtype, cr, ac,
        senses, lang, speed, source, skills, savingThrows, dmgImmunities, dmgResistance,
        dmgVulnerabilitie, conImmunities, sAblt, ablt, lAblt, size, alignment]);

    const resetSearch = () => {
        ReactDOM.unstable_batchedUpdates(() => {
            setName("");
            setType("");
            setSubtype("");
            setSize("");
            setType("");
            setAlignment("");
            setAc("");
            setSpeed("");
            setCr("");
            setSource("");
            setSavingThrows("");
            setSkills("");
            setSenses("");
            setLang("");
            setDmgVulnerabilitie("");
            setDmgResistance("");
            setDmgImmunities("");
            setConImmunities("");
            setSAblt("");
            setAblt("");
            setLAblt("");
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
            <button onClick={resetSearch}>
                <FontAwesomeIcon icon={faUndo} /> Reset
            </button>
        </div>
    );
}