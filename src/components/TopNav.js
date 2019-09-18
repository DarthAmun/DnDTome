import React, { Component } from 'react';
import '../assets/css/TopNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class TopNav extends Component {
    render() {
        return (
            <div id="topNav">
                <div id="topBar"></div>
                <a id="close" href="javascript:window.close()">
                    <FontAwesomeIcon icon={faTimes} />
                </a>
            </div>
        )
    }
}

export default TopNav;