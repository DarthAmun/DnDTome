import React, { Component } from 'react';

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