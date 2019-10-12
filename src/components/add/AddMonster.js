import React, { Component } from 'react';
import '../../assets/css/add/AddMonster.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

class AddMonster extends Component {
    state = {
        id: "",
        name: "",
        pic: "",
        size: "",
        type: "",
        subtype: "",
        alignment: "",
        ac: "",
        hp: "",
        speed: "",
        cr: "",
        source: "",
        str: "",
        dex: "",
        con: "",
        int: "",
        wis: "",
        cha: "",
        saveingThrows: "",
        skills: "",
        senses: "",
        lang: "",
        dmgVulnerabilitie: "",
        dmgResistance: "",
        dmgImmunities: "",
        conImmunities: "",
        sAblt: "",
        ablt: "",
        lAblt: ""
    }

    receiveMonster = (event, result) => {
        const text_sAblt = result.monster_sAblt.replace(/\\r\\n/gm, "\r\n");
        const text_ablt = result.monster_ablt.replace(/\\r\\n/gm, "\r\n");
        const text_lAbtl = result.monster_lAbtl.replace(/\\r\\n/gm, "\r\n");
        this.setState({
            ...this.state,
            id: result.monster_id,
            name: result.monster_name,
            pic: result.monster_pic,
            size: result.monster_size,
            type: result.monster_type,
            alignment: result.monster_alignment,
            ac: result.monster_armorClass,
            hp: result.monster_hitPoints,
            speed: result.monster_speed,
            cr: result.monster_cr,
            source: result.monster_source,
            str: result.monster_strength,
            dex: result.monster_dexterity,
            con: result.monster_constitution,
            int: result.monster_intelligence,
            wis: result.monster_wisdom,
            cha: result.monster_charisma,
            saveingThrows: result.monster_savingThrows,
            skills: result.monster_skills,
            senses: result.monster_senses,
            lang: result.monster_lang,
            dmgVulnerabilitie: result.monster_dmgVulnerabilities,
            dmgResistance: result.monster_dmgResistance,
            dmgImmunities: result.monster_dmgImmunities,
            conImmunities: result.monster_conImmunities,
            sAblt: text_sAblt,
            ablt: text_ablt,
            lAblt: text_lAbtl
        })
    }

    formatScore = (score) => {
        let mod = Math.floor((score - 10) / 2);
        if (mod >= 0) {
            return "+" + mod;
        } else {
            return mod;
        }
    }

    saveMonster = (e) => {
        ipcRenderer.send('saveNewMonster', { monster: this.state });
    }

    render() {
        const style = {
            backgroundImage: `url(${this.state.pic})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div id="monsterView">
                <div className="image" style={style}></div>
                <div className="top">
                    <label>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleNameChange} /></label>
                    <label>Size:<input name="size" type="text" value={this.state.size} onChange={this.handleSizeChange} /></label>
                    <label>Type:<input name="type" type="text" value={this.state.type} onChange={this.handleTypeChange} /></label>
                    <label>Subtype:<input name="subtype" type="text" value={this.state.subtype} onChange={this.handleSubtypeChange} /></label>
                    <label>Pic:<input name="pic" type="text" value={this.state.pic} onChange={this.handlePicChange} /></label>
                    <label>Source:<input name="source" type="text" value={this.state.source} onChange={this.handleSourceChange} /></label>
                </div>
                <div className="top">
                    <label>Cr:<input name="cr" type="text" value={this.state.cr} onChange={this.handleCrChange} /></label>
                    <label>Alignment:<input name="alignment" type="text" value={this.state.alignment} onChange={this.handleAlignmentChange} /></label>
                    <label>AC:<input name="ac" type="number" value={this.state.ac} onChange={this.handleACChange} /></label>
                    <label>Hit Points:<input name="hp" type="text" value={this.state.hp} onChange={this.handleHPChange} /></label>
                    <label>Speed:<input name="speed" type="text" value={this.state.speed} onChange={this.handleSpeedChange} /></label>
                    <button onClick={this.saveMonster}><FontAwesomeIcon icon={faSave} /> Save</button>
                </div>
                <div className="abilityScores">
                    <div className="score">
                        <label>Strength: <input type="number" value={this.state.str} onChange={this.handleStrChange}></input></label>
                        <div className="abilityBonus">{this.formatScore(this.state.str)}</div>
                    </div>
                    <div className="score">
                        <label>Dexterity: <input type="number" value={this.state.dex} onChange={this.handleDexChange}></input></label>
                        <div className="abilityBonus">{this.formatScore(this.state.dex)}</div>
                    </div>
                    <div className="score">
                        <label>Constitution: <input type="number" value={this.state.con} onChange={this.handleConChange}></input></label>
                        <div className="abilityBonus">{this.formatScore(this.state.con)}</div>
                    </div>
                    <div className="score">
                        <label>Intelligence: <input type="number" value={this.state.int} onChange={this.handleIntChange}></input></label>
                        <div className="abilityBonus">{this.formatScore(this.state.int)}</div>
                    </div>
                    <div className="score">
                        <label>Wisdom: <input type="number" value={this.state.wis} onChange={this.handleWisChange}></input></label>
                        <div className="abilityBonus">{this.formatScore(this.state.wis)}</div>
                    </div>

                    <div className="score">
                        <label>Charisma: <input type="number" value={this.state.cha} onChange={this.handleChaChange}></input></label>
                        <div className="abilityBonus">{this.formatScore(this.state.cha)}</div>
                    </div>
                </div>
                <div className="top">
                    <textarea className="small" value={this.state.saveingThrows} onChange={this.handleSaveingThrowsChange} placeholder="Saving Throws..."></textarea>
                    <textarea className="small" value={this.state.skills} onChange={this.handleSkillsChange} placeholder="Skills..."></textarea>
                    <textarea className="small" value={this.state.senses} onChange={this.handleSensesChange} placeholder="Senses..."></textarea>
                    <textarea className="small" value={this.state.lang} onChange={this.handleLangChange} placeholder="Languages..."></textarea>
                </div>
                <div className="top">
                    <textarea className="small" value={this.state.dmgVulnerabilitie} onChange={this.handleVulnerabilitieChange} placeholder="Vulnerabilities..."></textarea>
                    <textarea className="small" value={this.state.dmgResistance} onChange={this.handleResistanceChange} placeholder="Resistances..."></textarea>
                    <textarea className="small" value={this.state.dmgImmunities} onChange={this.handleImmunitiesChange} placeholder="Immunities..."></textarea>
                    <textarea className="small" value={this.state.conImmunities} onChange={this.handleConImmunitiesChange} placeholder="Condition immunities..."></textarea>
                </div>
                <textarea value={this.state.sAblt} onChange={this.handleSAbltChange} placeholder="Special abilities..."></textarea>
                <textarea value={this.state.ablt} onChange={this.handleAbltChange} placeholder="Actions..."></textarea>
                <textarea value={this.state.lAblt} onChange={this.handleLAblChange} placeholder="Legendary Actions..."></textarea>
            </div>
        )
    }

    handleConImmunitiesChange = (e) => {
        this.setState({
            ...this.state,
            conImmunities: e.target.value
        });
    }
    handleImmunitiesChange = (e) => {
        this.setState({
            ...this.state,
            dmgImmunities: e.target.value
        });
    }
    handleResistanceChange = (e) => {
        this.setState({
            ...this.state,
            dmgResistance: e.target.value
        });
    }
    handleVulnerabilitieChange = (e) => {
        this.setState({
            ...this.state,
            dmgVulnerabilitie: e.target.value
        });
    }
    handleLAblChange = (e) => {
        this.setState({
            ...this.state,
            lAblt: e.target.value
        });
    }
    handleAbltChange = (e) => {
        this.setState({
            ...this.state,
            ablt: e.target.value
        });
    }
    handleSAbltChange = (e) => {
        this.setState({
            ...this.state,
            sAblt: e.target.value
        });
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
    handleSizeChange = (e) => {
        this.setState({
            ...this.state,
            size: e.target.value
        });
    }
    handleTypeChange = (e) => {
        this.setState({
            ...this.state,
            type: e.target.value
        });
    }
    handleSubtypeChange = (e) => {
        this.setState({
            ...this.state,
            subtype: e.target.value
        });
    }
    handleAlignmentChange = (e) => {
        this.setState({
            ...this.state,
            alignment: e.target.value
        });
    }
    handleACChange = (e) => {
        this.setState({
            ...this.state,
            ac: e.target.value
        });
    }
    handleHPChange = (e) => {
        this.setState({
            ...this.state,
            hp: e.target.value
        });
    }
    handleSpeedChange = (e) => {
        this.setState({
            ...this.state,
            speed: e.target.value
        });
    }
    handleCrChange = (e) => {
        this.setState({
            ...this.state,
            cr: e.target.value
        });
    }
    handleSourceChange = (e) => {
        this.setState({
            ...this.state,
            source: e.target.value
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
    handleSaveingThrowsChange = (e) => {
        this.setState({
            ...this.state,
            saveingThrows: e.target.value
        });
    }
    handleSkillsChange = (e) => {
        this.setState({
            ...this.state,
            skills: e.target.value
        });
    }
    handleSensesChange = (e) => {
        this.setState({
            ...this.state,
            senses: e.target.value
        });
    }
    handleLangChange = (e) => {
        this.setState({
            ...this.state,
            lang: e.target.value
        });
    }
}

export default AddMonster;