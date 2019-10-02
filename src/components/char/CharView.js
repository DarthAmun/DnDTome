import React, { Component } from 'react';
import '../../assets/css/char/CharView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class CharView extends Component {
    state = {
        id: "",
        name: "",
        player: "",
        level: "",
        exp: "",
        pic: "",
        class: "",
        race: "",
        background: ""
    }

    receiveChar = (event, result) => {
        //const text = result.item_description.replace(/\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            name: result.char_name,
            id: result.char_id,
            player: result.char_player,
            pic: result.char_pic,
            level: result.char_level,
            exp: result.char_exp,
            class: result.char_class,
            race: result.char_race,
            background: result.char_background
        })
    }

    componentDidMount() {
        ipcRenderer.send('getChar', { id: this.props.match.params.id });
        ipcRenderer.on("getCharResult", this.receiveChar);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getCharResult", this.receiveChar)
    }

    handleNameChange = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }
    handlePicChange = (e) => {
        this.setState({
            ...this.state,
            pic: e.target.value
        });
    }
    handleLevelChange = (e) => {
        this.setState({
            ...this.state,
            level: e.target.value
        });
    }
    handleExpChange = (e) => {
        this.setState({
            ...this.state,
            exp: e.target.value
        });
    }
    handlePlayerChange = (e) => {
        this.setState({
            ...this.state,
            player: e.target.value
        });
    }
    handleClassChange = (e) => {
        this.setState({
            ...this.state,
            class: e.target.value
        });
    }
    handleRaceChange = (e) => {
        this.setState({
            ...this.state,
            race: e.target.value
        });
    }
    handleBackgroundChange = (e) => {
        this.setState({
            ...this.state,
            background: e.target.value
        });
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
                <div id="char">
                    <div className="image" style={style}></div>
                    <div className="labelGroup">
                        <label>Pic:<input name="pic" type="text" value={this.state.pic} onChange={this.handlePicChange} /></label>
                        <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label>
                        <label>Player:<input name="player" type="text" value={this.state.player} onChange={this.handlePlayerChange} /></label>
                        <label>Class:<input name="class" type="text" value={this.state.class} onChange={this.handleClassChange} /></label>
                    </div>
                    <div className="smallLabelGroup">
                        <label>Level:<input name="level" type="text" value={this.state.level} onChange={this.handleLevelChange} /></label>
                        <label>Exp:<input name="exp" type="text" value={this.state.exp} onChange={this.handleExpChange} /></label>
                        <label>Race:<input name="race" type="text" value={this.state.race} onChange={this.handleRaceChange} /></label>
                        <label>Background:<input name="background" type="text" value={this.state.background} onChange={this.handleBackgroundChange} /></label>
                    </div>
                </div>
            </div>
        )
    }
}

export default CharView;