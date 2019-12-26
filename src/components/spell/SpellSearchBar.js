import React, { useState, useEffect } from 'react';
import '../../assets/css/SearchBar.css';
import { reciveAttributeSelection } from '../../database/SpellService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import Select from 'react-select';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function SpellSearchBar({ callback }) {
    const [name, setName] = useState("");
    const [school, setSchool] = useState([]);
    const [schoolList, setSchoolList] = useState([]);
    const [level, setLevel] = useState("");
    const [levelList, setLevelList] = useState([]);
    // const [ritual, setRitual] = useState(0);
    const [time, setTime] = useState("");
    const [range, setRange] = useState("");
    const [duration, setDuration] = useState("");
    const [components, setComponents] = useState("");
    const [text, setText] = useState("");
    const [classes, setClasses] = useState("");
    const [sources, setSources] = useState("");

    // queryName="sendSpellSearchQuery"

    useEffect(() => {
        reciveAttributeSelection("school", function (result) {
            let schools = result.map(school => {
                return { value: school.spell_school, label: school.spell_school };
            })
            setSchoolList(schools);
        })
        reciveAttributeSelection("level", function (result) {
            let levels = result.map(level => {
                return { value: level.spell_level, label: level.spell_level};
            })
            setLevelList(levels);
        })
    }, []);

    useEffect(() => {
        callback({ name, school, level, time, range, duration, components, text, classes, sources });
    }, [name, school, level, time, range, duration, components, text, classes, sources]);

    const resetSearch = () => {

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
                value={school}
                onChange={school => setSchool(school)}
                options={schoolList}
                isMulti={true}
                styles={customStyles}
                placeholder="School..."
            />
            <Select
                value={level}
                onChange={level => setLevel(level)}
                options={levelList}
                isMulti={true}
                styles={customStyles}
                placeholder="Level..."
            />

            {/* <select value={school} onChange={e => setSchool(e.target.value)}>
                <option value="">All Schools</option>
                {schoolList.map((school, index) => {
                    return <option key={index} value={school.spell_school}>{school.spell_school}</option>;
                })}
            </select>
            <select value={level} onChange={e => setLevel(e.target.value)}>
                <option value="">All Levels</option>
                {levelList.map((level, index) => {
                    return <option key={index} value={level.spell_level}>{level.spell_level}</option>;
                })}
            </select> */}
            <button onClick={resetSearch}>
                <FontAwesomeIcon icon={faUndo} /> Reset
            </button>
        </div>
    );
}