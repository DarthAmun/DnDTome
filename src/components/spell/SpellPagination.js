import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Pagination.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class SpellPagination extends Component {
    state = {
        currentPage: 1,
        pageStep: 10,
        spellCount: 0,
        currentSpellList: { spells: [] }
    }

    receiveSpellCount = (evt, result) => {
        this.setState({
            ...this.state,
            spellCount: result[0].count,
            currentPage: 1
        })
    }

    componentDidMount() {
        ipcRenderer.send('getSpellCount');
        ipcRenderer.on("getSpellCountResult", this.receiveSpellCount);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getSpellCountResult", this.receiveSpellCount)
    }

    pageUp = () => {
        let count = Math.ceil(this.state.spellCount / 10);
        let newCount = this.state.currentPage + 1;
        if (newCount <= count) {
            this.setState({
                ...this.state,
                currentPage: (this.state.currentPage + 1)
            });
            ipcRenderer.send('getSearchSpells', { step: this.state.pageStep, start: (this.state.currentPage) * this.state.pageStep });
        }
    }
    pageDown = () => {
        if (this.state.currentPage > 1) {
            this.setState({
                ...this.state,
                currentPage: this.state.currentPage - 1
            });
            ipcRenderer.send('getSearchSpells', { step: this.state.pageStep, start: (this.state.currentPage - 2) * this.state.pageStep });
        }
    }
    pageJumpTo = (event) => {
        if (!isNaN(event.target.value)) {
            if (event.target.value > 0 && event.target.value <= Math.ceil(this.state.spellCount / 10)) {
                this.setState({
                    ...this.state,
                    currentPage: parseInt(event.target.value)
                });
            }
        }
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            ipcRenderer.send('getSearchSpells', { step: this.state.pageStep, start: (this.state.currentPage - 1) * this.state.pageStep });
        }
    }

    changeStep = (e) => {
        this.setState({
            ...this.state,
            pageStep: parseInt(e.target.value),
            currentPage: 1
        });
        ipcRenderer.send('getSearchSpells', { step: e.target.value, start: 0 });
    }

    render() {
        return (
            <div id="pagination">
                <div className="pageDown" onClick={this.pageDown}>
                    <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
                </div>
                <div id="pages">
                    <input id="pageInput" type="number" value={this.state.currentPage} min="1"
                        max={Math.ceil(this.state.spellCount / this.state.pageStep)}
                        onChange={this.pageJumpTo}
                        onKeyDown={this.handleKeyDown} />
                    | {Math.ceil(this.state.spellCount / this.state.pageStep)}
                </div>
                <div className="pageUp" onClick={this.pageUp}>
                    <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                </div>
                <div id="step">
                    <select name="stepSelect" onChange={this.changeStep} defaultValue="10">
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>
                <Link to="/add-spell" className="button">
                    <FontAwesomeIcon icon={faPlus} /> Add new Spell
                </Link>
            </div >
        )
    }
}

export default SpellPagination;