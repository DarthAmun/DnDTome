import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faBook } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/AddView.css';
import TopNav from './TopNav';
import LeftNav from './LeftNav';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class AddView extends Component {
    render() {
        return (
            <div id="overview">
                <div id="adds">
                    <Link to="/add-spell">
                        <div className="add">
                            <div className="addIcon"><FontAwesomeIcon icon={faBook} /></div><br />Add new Spell
                            </div>
                    </Link>
                    <Link to="/">
                        <div className="add">
                            <div className="addIcon"><FontAwesomeIcon icon={faIdCard} /></div><br />Add new Charakter
                            </div>
                    </Link>
                </div>
            </div>
        );
    }
}

export default AddView;