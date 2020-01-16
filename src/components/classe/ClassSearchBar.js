import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/SearchBar.css';
import { reciveAttributeSelection } from '../../database/ClassService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import Select from 'react-select';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function ClassSearchBar() {
    const [name, setName] = useState("");
    const [sources, setSources] = useState("");

    useEffect(() => {
        ipcRenderer.send("sendClassSearchQuery", { query: { name, sources} });
    }, [name, sources]);

    const resetSearch = () => {
        ReactDOM.unstable_batchedUpdates(() => {
            setName("");
            setSources("");
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
            <input type="text" name={sources} placeholder="Sources..." value={sources} onChange={e => setSources(e.target.value)} />
            <button onClick={resetSearch}>
                <FontAwesomeIcon icon={faUndo} /> Reset
            </button>
        </div>
    );
}