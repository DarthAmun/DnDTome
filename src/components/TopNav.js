import React, { Component } from 'react';
import '../assets/css/TopNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class TopNav extends Component {

    closeMainWindow = () => {
        ipcRenderer.send('closeMainWindow');
    }

    render() {
        return (
            <div id="topNav">
                <div id="topBar"></div>
                <div id="close" onClick={() => this.closeMainWindow()}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>
        )
    }
}

export default TopNav;