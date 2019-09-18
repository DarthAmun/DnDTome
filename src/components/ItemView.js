import React, { Component } from 'react';
import '../assets/css/ItemView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class ItemView extends Component {
    state = {
        name: "",
        id: "",
        description: "",
        pic: "",
        rarity: "",
        type: "",
        show: "none",
        width: "0px"
    }

    receiveItem = (result) => {
        const text = result.item_description.replace(/\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            name: result.item_name,
            id: result.item_id,
            description: text,
            pic: result.item_pic,
            rarity: result.item_rarity,
            type: result.item_type,
            show: "block",
            width: "450px"
        })
    }

    componentDidMount() {
        if(this.props.item != null){
            this.receiveItem(this.props.item);
        }
    }

    componentDidUpdate(prev) {
        if (this.props.item != prev.item) {
            this.receiveItem(this.props.item);
        }
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
        ipcRenderer.send('deleteItem', { item: this.state });
        this.setState({
            ...this.state,
            redirectToOverview: true
        });
    }

    back = (e) => {
        this.setState({
            ...this.state,
            width: "0px",
            show: "none"
        });
        ipcRenderer.send('backItem');
    }

    render() {
        return (
                    <div id="itemView" style={{ display: `${this.state.show}`, width: `${this.state.width}` }}>
                        <div className="top">
                            <label><img src={this.state.pic}></img></label>
                            <label>Pic:<input name="pic" type="text" value={this.state.pic} onChange={this.handlePicChange} /></label>
                            <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label>
                            <label>Rarity:<input name="rarity" type="text" value={this.state.rarity} onChange={this.handleRarityChange} /></label>
                            <label>Type:<input name="type" type="text" value={this.state.type} onChange={this.handleTypeChange} /></label>
                        </div>
                        <textarea value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
                        <button className="back" onClick={this.back}><FontAwesomeIcon icon={faArrowCircleLeft} /> Back</button>
                        <button className="delete" onClick={this.deleteItem}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                        <button onClick={this.saveItem}><FontAwesomeIcon icon={faSave} /> Save</button>
                    </div>
                    
        )
    }
}

export default ItemView;