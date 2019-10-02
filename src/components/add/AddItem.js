import React, { Component } from 'react';
import '../../assets/css/add/AddItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class AddItem extends Component {
    state = {
        name: "",
        id: "",
        description: "",
        pic: "",
        rarity: "",
        type: "",
        source: ""
    }

    handleNameChange = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }
    handleDescriptionChange = (e) => {
        this.setState({
            ...this.state,
            description: e.target.value
        });
    }
    handlePicChange = (e) => {
        this.setState({
            ...this.state,
            pic: e.target.value
        });
    }
    handleRarityChange = (e) => {
        this.setState({
            ...this.state,
            rarity: e.target.value
        });
    }
    handleTypeChange = (e) => {
        this.setState({
            ...this.state,
            type: e.target.value
        });
    }
    handleSourceChange = (e) => {
        this.setState({
            ...this.state,
            source: e.target.value
        });
    }

    saveItem = (e) => {
        ipcRenderer.send('saveNewItem', { item: this.state });
    }

    render() {
        const style = {
            backgroundImage: `url(${this.state.pic})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div id="overview">
                <div id="newItem">
                    <div className="image" style={style}></div>
                    <textarea value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
                    <div className="top">
                        <label>Pic:<input name="pic" type="text" value={this.state.pic} onChange={this.handlePicChange} /></label>
                        <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label>
                        <label>Sources:<input name="name" type="text" value={this.state.source} onChange={this.handleSourceChange} /></label>
                    </div>
                    <div className="top">
                        <label>Rarity:<input name="rarity" type="text" value={this.state.rarity} onChange={this.handleRarityChange} /></label>
                        <label>Type:<input name="type" type="text" value={this.state.type} onChange={this.handleTypeChange} /></label>
                        <button onClick={this.saveItem}><FontAwesomeIcon icon={faSave} /> Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddItem;