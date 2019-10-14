import React, { Component } from 'react';
import '../assets/css/TopNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faWindowMinimize } from '@fortawesome/free-regular-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class TopNav extends Component {

    closeMainWindow = () => {
        ipcRenderer.send('closeMainWindow');
    }

    minimizeWindow = () => {
        ipcRenderer.send('minimizeMainWindow');
    }

    render() {
        return (
            <div id="topNav">
                <div id="topBar"></div>
                <div id="close" onClick={() => this.closeMainWindow()}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <div id="minimize" onClick={() => this.minimizeWindow()}>
                    <FontAwesomeIcon icon={faWindowMinimize} />
                </div>
            </div>
        )
    }
}

export default TopNav;