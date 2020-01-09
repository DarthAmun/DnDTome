import React, { useState } from 'react';
import { saveNewMonster } from '../../database/MonsterService';
import '../../assets/css/monster/MonsterView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export default function AddMonster() {
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [size, setSize] = useState("");
    const [type, setType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [alignment, setAlignment] = useState("");
    const [ac, setAc] = useState(0);
    const [hp, setHp] = useState("");
    const [speed, setSpeed] = useState("");
    const [cr, setCr] = useState("");
    const [source, setSource] = useState("");
    const [str, setStr] = useState(0);
    const [dex, setDex] = useState(0);
    const [con, setCon] = useState(0);
    const [int, setInt] = useState(0);
    const [wis, setWis] = useState(0);
    const [cha, setCha] = useState(0);
    const [savingThrows, setSavingThrows] = useState("");
    const [skills, setSkills] = useState("");
    const [senses, setSenses] = useState("");
    const [lang, setLang] = useState("");
    const [dmgVulnerabilitie, setDmgVulnerabilitie] = useState("");
    const [dmgResistance, setDmgResistance] = useState("");
    const [dmgImmunities, setDmgImmunities] = useState("");
    const [conImmunities, setConImmunities] = useState("");
    const [sAblt, setSAblt] = useState("");
    const [ablt, setAblt] = useState("");
    const [lAblt, setLAblt] = useState("");

    const formatScore = (score) => {
        let mod = Math.floor((score - 10) / 2);
        if (mod >= 0) {
            return "+" + mod;
        } else {
            return mod;
        }
    }

    const saveMonsterAction = (e) => {
        saveNewMonster({
            name, type, subtype, cr, ac, hp, str, dex, con,
            int, wis, cha, senses, lang, speed, source, skills, savingThrows, dmgImmunities, dmgResistance,
            dmgVulnerabilitie, conImmunities, sAblt, ablt, lAblt, pic, size, alignment
        });
    }

    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div id="monsterView">
            <div className="image" style={style}></div>
            <div className="top">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label>
                <label>Type:<input name="type" type="text" value={type} onChange={e => setType(e.target.value)} /></label>
                <label>Subtype:<input name="subtype" type="text" value={subtype} onChange={e => setSubtype(e.target.value)} /></label>
                <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                <label>Source:<input name="source" type="text" value={source} onChange={e => setSource(e.target.value)} /></label>
                <button onClick={saveMonsterAction}><FontAwesomeIcon icon={faSave} /> Save</button>
           </div>
            <div className="top">
                <label className="smallLabel">Cr:<input name="cr" type="text" value={cr} onChange={e => setCr(e.target.value)} /></label>
                <label className="smallLabel">AC:<input name="ac" type="number" value={ac} onChange={e => setAc(e.target.value)} /></label>
                <label>Alignment:<input name="alignment" type="text" value={alignment} onChange={e => setAlignment(e.target.value)} /></label>
                <label>Hit Points:<input name="hp" type="text" value={hp} onChange={e => setHp(e.target.value)} /></label>
                <label>Speed:<input name="speed" type="text" value={speed} onChange={e => setSpeed(e.target.value)} /></label>
                <label>Size:<input name="size" type="text" value={size} onChange={e => setSize(e.target.value)} /></label>
            </div>
            <div className="abilityScores">
                <div className="score">
                    <label>Strength: <input type="number" value={str} onChange={e => setStr(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(str)}</div>
                </div>
                <div className="score">
                    <label>Dexterity: <input type="number" value={dex} onChange={e => setDex(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(dex)}</div>
                </div>
                <div className="score">
                    <label>Constitution: <input type="number" value={con} onChange={e => setCon(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(con)}</div>
                </div>
                <div className="score">
                    <label>Intelligence: <input type="number" value={int} onChange={e => setInt(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(int)}</div>
                </div>
                <div className="score">
                    <label>Wisdom: <input type="number" value={wis} onChange={e => setWis(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(wis)}</div>
                </div>

                <div className="score">
                    <label>Charisma: <input type="number" value={cha} onChange={e => setCha(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(cha)}</div>
                </div>
            </div>
            <div className="top">
                <textarea className="small" value={savingThrows} onChange={e => setSavingThrows(e.target.value)} placeholder="Saving Throws..."></textarea>
                <textarea className="small" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills..."></textarea>
                <textarea className="small" value={senses} onChange={e => setSenses(e.target.value)} placeholder="Senses..."></textarea>
                <textarea className="small" value={lang} onChange={e => setLang(e.target.value)} placeholder="Languages..."></textarea>
            </div>
            <div className="top">
                <textarea className="small" value={dmgVulnerabilitie} onChange={e => setDmgVulnerabilitie(e.target.value)} placeholder="Vulnerabilities..."></textarea>
                <textarea className="small" value={dmgResistance} onChange={e => setDmgResistance(e.target.value)} placeholder="Resistances..."></textarea>
                <textarea className="small" value={dmgImmunities} onChange={e => setDmgImmunities(e.target.value)} placeholder="Damage immunities..."></textarea>
                <textarea className="small" value={conImmunities} onChange={e => setConImmunities(e.target.value)} placeholder="Condition immunities..."></textarea>
            </div>
            <textarea value={sAblt} onChange={e => setSAblt(e.target.value)} placeholder="Special abilities..."></textarea>
            <textarea value={ablt} onChange={e => setAblt(e.target.value)} placeholder="Actions..."></textarea>
            <textarea value={lAblt} onChange={e => setLAblt(e.target.value)} placeholder="Legendary Actions..."></textarea>
        </div>
    )
}
