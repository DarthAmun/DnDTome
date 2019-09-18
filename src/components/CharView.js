import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../assets/css/SpellView.css';
import LeftNav from './LeftNav';
import TopNav from './TopNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class SpellOverview extends Component {
    render() {
        //if (this.state.redirectToOverview) return <Redirect to='/spell-overview' />;
        return (
            <div id="overview">
                <div id="char">

                </div>
            </div>
        )
    }
}

export default SpellOverview;