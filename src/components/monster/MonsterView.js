import React, { Component } from 'react';
import '../../assets/css/monster/MonsterView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

class MonsterView extends Component {
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

    receiveMonster = (event, result) => {
        const text = result.monster_text.replace(/\\n/gm, "\r\n");
        const sources = result.monster_sources.replace(/\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            name: result.monster_name,
            school: result.monster_school,
            level: result.monster_level,
            time: result.monster_time,
            range: result.monster_range,
            duration: result.monster_duration,
            components: result.monster_components,
            text: text,
            classes: result.monster_classes,
            sources: sources,
            id: result.monster_id
        })
    }

    componentDidMount() {
        ipcRenderer.on("onViewMonster", this.receiveMonster);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("onViewMonster", this.receiveMonster);
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

    saveMonster = (e) => {
        ipcRenderer.send('saveMonster', { monster: this.state });
    }

    deleteMonster = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${this.state.name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if(response == 1){
                ipcRenderer.send('deleteMonster', { monster: this.state });
            }
        });
    }

    render() {
        return (
            <div id="monsterView">
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
                <button className="delete" onClick={this.deleteMonster}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={this.saveMonster}><FontAwesomeIcon icon={faSave} /> Save</button>
            </div>
        )
    }
}

export default MonsterView;