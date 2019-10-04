import React, { Component } from 'react';
import '../../assets/css/char/CharView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class CharView extends Component {
    state = {
        lastSave: new Date().getSeconds(),
        id: "",
        name: "",
        player: "",
        prof: "",
        exp: "",
        pic: "",
        class: "",
        race: "",
        background: "",
        ac: "",
        hp: "",
        currentHp: "",
        init: "",
        str: "",
        dex: "",
        con: "",
        int: "",
        wis: "",
        cha: "",
        actions: "",
        features: "",
        profsLangs: "",
        notes: "",
        spells: []
    }

    receiveChar = (event, result) => {
        //const text = result.item_description.replace(/\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            name: result.char_name,
            id: result.char_id,
            player: result.char_player,
            pic: result.char_pic,
            prof: result.char_prof,
            exp: result.char_exp,
            class: result.char_class,
            race: result.char_race,
            background: result.char_background,
            ac: result.char_ac,
            hp: result.char_hp,
            currentHp: result.char_hp_current,
            init: result.char_init,
            str: result.char_str,
            dex: result.char_dex,
            con: result.char_con,
            int: result.char_int,
            wis: result.char_wis,
            cha: result.char_cha,
            actions: result.char_actions,
            features: result.char_features,
            profsLangs: result.char_profs_langs,
            notes: result.char_notes
        })
    }

    receiveSpells = (event, result) => {
        this.setState({
            ...this.state,
            spells: result
        })
    }

    componentDidMount() {
        ipcRenderer.send('getChar', { id: this.props.match.params.id });
        ipcRenderer.on("getCharResult", this.receiveChar);
        ipcRenderer.send('getCharSpells', { id: this.props.match.params.id });
        ipcRenderer.on("getCharSpellsResult", this.receiveSpells);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getCharResult", this.receiveChar)
        ipcRenderer.removeListener("getCharSpellsResult", this.receiveSpells);
        ipcRenderer.send('saveChar', { char: this.state });
    }
    componentDidUpdate(prevProps, prevState) {
        let sec = new Date().getSeconds();
        if (prevState !== this.state && ((this.state.lastSave + 3) <= sec)) {
            this.setState({
                ...this.state,
                lastSave: sec
            });
            ipcRenderer.send('saveChar', { char: this.state });
        }
    }

    formatScore = (score) => {
        let mod = Math.floor((score - 10) / 2);
        if (mod >= 0) {
            return "+" + mod;
        } else {
            return mod;
        }
    }

    formatCastingTime = (value) => {
        let words = value.split(',');
        return words[0];
    }

    viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
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
                        <label>Pic:<input name="pic" type="text" value={this.state.pic} onChange={this.handlePicChange} /></label><br />
                        <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label><br />
                        <label>Player:<input name="player" type="text" value={this.state.player} onChange={this.handlePlayerChange} /></label><br />
                        <label>Class:<input name="class" type="text" value={this.state.class} onChange={this.handleClassChange} /></label>
                    </div>
                    <div className="smallLabelGroup">
                        <label>Exp:<input name="exp" type="number" value={this.state.exp} onChange={this.handleExpChange} /></label><br />
                        <label>Race:<input name="race" type="text" value={this.state.race} onChange={this.handleRaceChange} /></label><br />
                        <label>Background:<input name="background" type="text" value={this.state.background} onChange={this.handleBackgroundChange} /></label><br />
                        <label>Proficiency:<input name="level" type="number" value={this.state.prof} onChange={this.handleProfChange} /></label>
                    </div>
                    <div className="smallLabelGroup">
                        <label>HP:<input name="hp" type="number" value={this.state.hp} onChange={this.handleHPChange} /></label><br />
                        <label>Current Hp:<input name="currentHP" type="number" value={this.state.currentHp} onChange={this.handleCurrentHPChange} /></label><br />
                        <label>Armor Class:<input name="ac" type="number" value={this.state.ac} onChange={this.handleACChange} /></label><br />
                        <label>Initiative:<input name="initiativ" type="number" value={this.state.init} onChange={this.handleInitChange} /></label>
                    </div>
                    <div className="abilityScores">
                        <div className="score">
                            <label>Strength: <input type="number" value={this.state.str} onChange={this.handleStrChange}></input></label>
                            <div className="abilityBonus">{this.formatScore(this.state.str)}</div>
                        </div>
                        <div className="score">
                            <label>Intelligence: <input type="number" value={this.state.int} onChange={this.handleIntChange}></input></label>
                            <div className="abilityBonus">{this.formatScore(this.state.int)}</div>
                        </div>
                        <div className="score">
                            <label>Dexterity: <input type="number" value={this.state.dex} onChange={this.handleDexChange}></input></label>
                            <div className="abilityBonus">{this.formatScore(this.state.dex)}</div>
                        </div>
                        <div className="score">
                            <label>Wisdom: <input type="number" value={this.state.wis} onChange={this.handleWisChange}></input></label>
                            <div className="abilityBonus">{this.formatScore(this.state.wis)}</div>
                        </div>
                        <div className="score">
                            <label>Constitution: <input type="number" value={this.state.con} onChange={this.handleConChange}></input></label>
                            <div className="abilityBonus">{this.formatScore(this.state.con)}</div>
                        </div>
                        <div className="score">
                            <label>Charisma: <input type="number" value={this.state.cha} onChange={this.handleChaChange}></input></label>
                            <div className="abilityBonus">{this.formatScore(this.state.cha)}</div>
                        </div>
                    </div>
                    <textarea value={this.state.actions} onChange={this.handleActionsChange} placeholder="Actions..."></textarea>
                    <textarea value={this.state.features} onChange={this.handleFeaturesChange} placeholder="Features..."></textarea>
                    <textarea value={this.state.profsLangs} onChange={this.handleProfsLangsChange} placeholder="Proficiencies & Languages..."></textarea>
                    <textarea value={this.state.notes} onChange={this.handleNotesChange} placeholder="Notes..."></textarea>
                    <div className="charSpells">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Lvl</th>
                                    <th>Name</th>
                                    <th>Casting Time</th>
                                    <th>Range</th>
                                </tr>
                                {this.state.spells.map((spell, index) => {
                                    return <tr className="charSpell" key={spell.spell_id} onClick={() => this.viewSpell(spell)} style={{ cursor: 'pointer' }}><td>{spell.spell_level}</td><td>{spell.spell_name}</td><td>{this.formatCastingTime(spell.spell_time)}</td><td>{spell.spell_range}</td></tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
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
    handleProfChange = (e) => {
        this.setState({
            ...this.state,
            prof: e.target.value
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
    handleHPChange = (e) => {
        this.setState({
            ...this.state,
            hp: e.target.value
        });
    }
    handleCurrentHPChange = (e) => {
        this.setState({
            ...this.state,
            currentHp: e.target.value
        });
    }
    handleACChange = (e) => {
        this.setState({
            ...this.state,
            ac: e.target.value
        });
    }
    handleInitChange = (e) => {
        this.setState({
            ...this.state,
            init: e.target.value
        });
    }
    handleStrChange = (e) => {
        this.setState({
            ...this.state,
            str: e.target.value
        });
    }
    handleDexChange = (e) => {
        this.setState({
            ...this.state,
            dex: e.target.value
        });
    }
    handleConChange = (e) => {
        this.setState({
            ...this.state,
            con: e.target.value
        });
    }
    handleIntChange = (e) => {
        this.setState({
            ...this.state,
            int: e.target.value
        });
    }
    handleWisChange = (e) => {
        this.setState({
            ...this.state,
            wis: e.target.value
        });
    }
    handleChaChange = (e) => {
        this.setState({
            ...this.state,
            cha: e.target.value
        });
    }
    handleActionsChange = (e) => {
        this.setState({
            ...this.state,
            actions: e.target.value
        });
    }
    handleFeaturesChange = (e) => {
        this.setState({
            ...this.state,
            features: e.target.value
        });
    }
    handleProfsLangsChange = (e) => {
        this.setState({
            ...this.state,
            profsLangs: e.target.value
        });
    }
    handleNotesChange = (e) => {
        this.setState({
            ...this.state,
            notes: e.target.value
        });
    }
}

export default CharView;