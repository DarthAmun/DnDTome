import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/char/CharOverview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Char from './Char';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class SpellOverview extends Component {
    state = {
        currentCharList: { chars: [] }
    }

    receiveChars = (evt, result) => {
        this.setState({
            currentCharList: {
                chars: result
            }
        })
    }

    componentDidMount() {
        ipcRenderer.send('getChars', { step: 10, start: 0 });
        ipcRenderer.on("getCharsResult", this.receiveChars);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getCharsResult", this.receiveChars)
    }

    render() {
        return (
            <div id="overview">
                <div id="chars">
                    <Link to="/">
                        <div className="add">
                            <div className="addIcon"><FontAwesomeIcon icon={faUserPlus} /></div><br />Add new Charakter
                        </div>
                    </Link>
                    {this.state.currentCharList.chars.map((char, index) => {
                        return <Char delay={index} char={char} key={char.char_id} />;
                    })}
                </div>
            </div>
        )
    }
}

export default SpellOverview;