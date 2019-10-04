import React, { Component } from 'react';
import '../../assets/css/spell/SpellView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

class SpellView extends Component {
    state = {
        name: "",
        school: "",
        level: "",
        time: "",
        range: "",
        duration: "",
        components: "",
        text: "",
        classes: "",
        sources: "",
        id: ""
    }

    receiveSpell = (event, result) => {
        const text = result.spell_text.replace(/\\n/gm, "\r\n");
        const sources = result.spell_sources.replace(/\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            name: result.spell_name,
            school: result.spell_school,
            level: result.spell_level,
            time: result.spell_time,
            range: result.spell_range,
            duration: result.spell_duration,
            components: result.spell_components,
            text: text,
            classes: result.spell_classes,
            sources: sources,
            id: result.spell_id
        })
    }

    componentDidMount() {
        ipcRenderer.on("onViewSpell", this.receiveSpell);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("onViewSpell", this.receiveSpell);
    }

    handleNameChange = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }
    handleSchoolChange = (e) => {
        this.setState({
            ...this.state,
            school: e.target.value
        });
    }
    handleLevelChange = (e) => {
        this.setState({
            ...this.state,
            level: e.target.value
        });
    }
    handleTimeChange = (e) => {
        this.setState({
            ...this.state,
            time: e.target.value
        });
    }
    handleRangeChange = (e) => {
        this.setState({
            ...this.state,
            range: e.target.value
        });
    }
    handleDurationChange = (e) => {
        this.setState({
            ...this.state,
            duration: e.target.value
        });
    }
    handleComponentsChange = (e) => {
        this.setState({
            ...this.state,
            components: e.target.value
        });
    }
    handleClassesChange = (e) => {
        this.setState({
            ...this.state,
            classes: e.target.value
        });
    }
    handleSourcesChange = (e) => {
        this.setState({
            ...this.state,
            sources: e.target.value
        });
    }

    handleChange = (e) => {
        this.setState({
            ...this.state,
            text: e.target.value
        });
    }

    saveSpell = (e) => {
        ipcRenderer.send('saveSpell', { spell: this.state });
    }

    addSpellToChar = (e) => {
        
    }

    deleteSpell = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${this.state.name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if(response == 1){
                ipcRenderer.send('deleteSpell', { spell: this.state });
            }
        });
    }

    render() {
        return (
            <div id="spellView">
                <div className="top">
                    <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label>
                    <label>School:<input name="school" type="text" value={this.state.school} onChange={this.handleSchoolChange} /></label>
                    <label>Level:<input name="level" type="text" value={this.state.level} onChange={this.handleLevelChange} /></label>
                    <label>Casting Time:<input name="time" type="text" value={this.state.time} onChange={this.handleTimeChange} /></label>
                    <label>Range:<input name="range" type="text" value={this.state.range} onChange={this.handleRangeChange} /></label>
                    <label>Duration:<input name="duration" type="text" value={this.state.duration} onChange={this.handleDurationChange} /></label>
                    <label>Components:<input name="components" type="text" value={this.state.components} onChange={this.handleComponentsChange} /></label>
                    <label>Classes:<input name="classes" type="text" value={this.state.classes} onChange={this.handleClassesChange} /></label>
                    <label>Sources:<input name="sources" type="text" value={this.state.sources} onChange={this.handleSourcesChange} /></label>
                </div>
                <textarea value={this.state.text} onChange={this.handleChange}></textarea>
                <button className="delete" onClick={this.deleteSpell}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={this.saveSpell}><FontAwesomeIcon icon={faSave} /> Save</button>
                <button onClick={this.addSpellToChar}><FontAwesomeIcon icon={faPlus} /> Add to char</button>
            </div>
        )
    }
}

export default SpellView;