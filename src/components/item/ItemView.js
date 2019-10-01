import React, { Component } from 'react';
import '../../assets/css/ItemView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

class ItemView extends Component {
    state = {
        name: "",
        id: "",
        description: "",
        pic: "",
        rarity: "",
        type: ""
    }

    receiveItem = (event, result) => {
        const text = result.item_description.replace(/\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            name: result.item_name,
            id: result.item_id,
            description: text,
            pic: result.item_pic,
            rarity: result.item_rarity,
            type: result.item_type
        })
    }

    componentDidMount() {
        ipcRenderer.on("onViewItem", this.receiveItem);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("onViewItem", this.receiveItem);
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

    saveItem = (e) => {
        ipcRenderer.send('saveItem', { item: this.state });
    }

    deleteItem = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${this.state.name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                ipcRenderer.send('deleteItem', { item: this.state });
            }
        });
    }

    render() {
        return (
            <div id="itemView">
                <div className="top">
                    <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label>
                    <label>Pic:<input name="pic" type="text" value={this.state.pic} onChange={this.handlePicChange} /></label>
                </div>
                <div className="top">
                    <label>Rarity:<input name="rarity" type="text" value={this.state.rarity} onChange={this.handleRarityChange} /></label>
                    <label>Type:<input name="type" type="text" value={this.state.type} onChange={this.handleTypeChange} /></label>
                </div>
                <button className="delete" onClick={this.deleteItem}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={this.saveItem}><FontAwesomeIcon icon={faSave} /> Save</button>
                <div className="image"><img src={this.state.pic}></img></div>
                <textarea value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
            </div>

        )
    }
}

export default ItemView;