import React, { useState, useEffect } from 'react';
import '../../assets/css/char/CharView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function CharView(props) {
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [player, setPlayer] = useState("");
    const [prof, setProf] = useState(0);
    const [exp, setExp] = useState(0);
    const [pic, setPic] = useState("");
    const [classes, setClasses] = useState("");
    const [race, setRace] = useState("");
    const [background, setBackground] = useState("");
    const [ac, setAc] = useState(0);
    const [hp, setHp] = useState(0);
    const [currentHp, setCurrentHp] = useState(0);
    const [init, setInit] = useState(0);

    const [str, setStr] = useState(0);
    const [dex, setDex] = useState(0);
    const [con, setCon] = useState(0);
    const [int, setInt] = useState(0);
    const [wis, setWis] = useState(0);
    const [cha, setCha] = useState(0);
    const [strSave, setStrSave] = useState(0);
    const [dexSave, setDexSave] = useState(0);
    const [conSave, setConSave] = useState(0);
    const [intSave, setIntSave] = useState(0);
    const [wisSave, setWisSave] = useState(0);
    const [chaSave, setChaSave] = useState(0);

    const [actions, setActions] = useState("");
    const [features, setFeatures] = useState("");
    const [profsLangs, setProfsLangs] = useState("");
    const [notes, setNotes] = useState("");

    const [acrobatics, setAcrobatics] = useState(0);
    const [animalHandling, setAnimalHandling] = useState(0);
    const [arcana, setArcana] = useState(0);
    const [athletics, setAthletics] = useState(0);
    const [deception, setDeception] = useState(0);
    const [history, setHistory] = useState(0);
    const [insight, setInsight] = useState(0);
    const [intimidation, setIntimidation] = useState(0);
    const [investigation, setInvestigation] = useState(0);
    const [medicine, setMedicine] = useState(0);
    const [nature, setNature] = useState(0);
    const [perception, setPerception] = useState(0);
    const [performance, setPerformance] = useState(0);
    const [persuasion, setPersuasion] = useState(0);
    const [religion, setReligion] = useState(0);
    const [sleightOfHand, setSleightOfHand] = useState(0);
    const [stealth, setStealth] = useState(0);
    const [survival, setSurvival] = useState(0);

    const [spells, setSpells] = useState([]);

    const receiveChar = (event, result) => {
        setName(result.char_name);
        setId(result.char_id);
        setPlayer(result.char_player);
        setPic(result.char_pic);
        setProf(result.char_prof);
        setExp(result.char_exp);
        setClasses(result.char_classes);
        setRace(result.char_race);
        setBackground(result.char_background);
        setAc(result.char_ac);
        setHp(result.char_hp);
        setCurrentHp(result.char_hp_current);
        setInit(result.char_init);

        setStr(result.char_str);
        setDex(result.char_dex);
        setCon(result.char_con);
        setInt(result.char_int);
        setWis(result.char_wis);
        setCha(result.char_cha);
        setStrSave(result.char_strSave);
        setDexSave(result.char_dexSave);
        setConSave(result.char_conSave);
        setIntSave(result.char_intSave);
        setWisSave(result.char_wisSave);
        setChaSave(result.char_chaSave);

        setActions(result.char_actions);
        setFeatures(result.char_features);
        setProfsLangs(result.char_profs_langs);
        setNotes(result.char_notes);

        setAcrobatics(result.char_acrobatics);
        setAnimalHandling(result.char_animalHandling);
        setArcana(result.char_arcana);
        setAthletics(result.char_athletics);
        setDeception(result.char_deception);
        setHistory(result.char_history);
        setInsight(result.char_insight);
        setIntimidation(result.char_intimidation);
        setInvestigation(result.char_investigation);
        setMedicine(result.char_medicine);
        setNature(result.char_nature);
        setPerception(result.char_perception);
        setPerformance(result.char_performance);
        setPersuasion(result.char_persuasion);
        setReligion(result.char_religion);
        setSleightOfHand(result.char_sleightOfHand);
        setStealth(result.char_stealth);
        setSurvival(result.char_survival);
    }

    const receiveSpells = (event, result) => {
        setSpells(result);
    }

    useEffect(() => {
        ipcRenderer.send('getChar', { id: props.match.params.id });
        ipcRenderer.on("getCharResult", receiveChar);
        ipcRenderer.send('getCharSpells', { id: props.match.params.id });
        ipcRenderer.on("getCharSpellsResult", receiveSpells);
        return () => {
            ipcRenderer.removeListener("getCharResult", receiveChar)
            ipcRenderer.removeListener("getCharSpellsResult", receiveSpells);
        }
    }, []);

    const formatScore = (score) => {
        let mod = Math.floor((score - 10) / 2);
        if (mod >= 0) {
            return "+" + mod;
        } else {
            return mod;
        }
    }

    const formatCastingTime = (value) => {
        let words = value.split(',');
        return words[0];
    }

    const viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }

    const saveChar = (spell) => {
        ipcRenderer.send('saveChar', {
            char: {
                id, name, player, prof, exp, pic, classes, race, background, ac, hp, currentHp,
                init, str, dex, con, int, wis, cha, strSave, dexSave, conSave, intSave, wisSave, chaSave,
                actions, features, profsLangs, notes, acrobatics, animalHandling, arcana,
                athletics, deception, history, insight, intimidation, investigation, medicine, nature,
                perception, performance, persuasion, religion, sleightOfHand, stealth, survival
            }
        });;
    }


    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div id="overview">
            <div id="char">
                <div className="image" style={style}></div>
                <div className="smallLabelGroup">
                    <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label><br />
                    <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label><br />
                    <label>Player:<input name="player" type="text" value={player} onChange={e => setPlayer(e.target.value)} /></label><br />
                    <label>Class:<input name="class" type="text" value={classes} onChange={e => setClasses(e.target.value)} /></label>
                </div>
                <div className="smallLabelGroup">
                    <label>Exp:<input name="exp" type="number" value={exp} onChange={e => setExp(e.target.value)} /></label><br />
                    <label>Race:<input name="race" type="text" value={race} onChange={e => setRace(e.target.value)} /></label><br />
                    <label>Background:<input name="background" type="text" value={background} onChange={e => setBackground(e.target.value)} /></label><br />
                    <label>Proficiency:<input name="level" type="number" value={prof} onChange={e => setProf(e.target.value)} /></label>
                </div>
                <div className="smallLabelGroup">
                    <label>HP:<input name="hp" type="number" value={hp} onChange={e => setHp(e.target.value)} /></label><br />
                    <label>Current Hp:<input name="currentHP" type="number" value={currentHp} onChange={e => setCurrentHp(e.target.value)} /></label><br />
                    <label>Armor Class:<input name="ac" type="number" value={ac} onChange={e => setAc(e.target.value)} /></label><br />
                    <label>Initiative:<input name="initiativ" type="number" value={init} onChange={e => setInit(e.target.value)} /></label>
                </div>
                <div className="deathSaves">
                    <b>Death Saves:</b>
                    <div className="deathSave">Sucesses: <input type="radio" /><input type="radio" /><input type="radio" /></div>
                    <div className="deathSave">Failures: <input type="radio" /><input type="radio" /><input type="radio" /></div>
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
                <div className="savingThrows">
                    <label>Str Save: <input type="number" value={strSave} onChange={e => setStrSave(e.target.value)}></input><input type="radio" /></label>
                    <label>Dex Save: <input type="number" value={dexSave} onChange={e => setDexSave(e.target.value)}></input><input type="radio" /></label>
                    <label>Con Save: <input type="number" value={conSave} onChange={e => setConSave(e.target.value)}></input><input type="radio" /></label>
                    <label>Int Save: <input type="number" value={intSave} onChange={e => setIntSave(e.target.value)}></input><input type="radio" /></label>
                    <label>Wis Save: <input type="number" value={wisSave} onChange={e => setWisSave(e.target.value)}></input><input type="radio" /></label>
                    <label>Cha Save: <input type="number" value={chaSave} onChange={e => setCha(e.target.value)}></input><input type="radio" /></label>
                </div>
                <div className="skills">
                    <div classame="skillRow">
                        <label>Acrobatics (Dex): <input type="number" value={acrobatics} onChange={e => setAcrobatics(e.target.value)}></input><input type="radio" /></label>
                        <label>Animal Handling (Wis): <input type="number" value={animalHandling} onChange={e => setAnimalHandling(e.target.value)}></input><input type="radio" /></label>
                        <label>Arcana (Int): <input type="number" value={arcana} onChange={e => setArcana(e.target.value)}></input><input type="radio" /></label>
                        <label>Athletics (Str): <input type="number" value={athletics} onChange={e => setAthletics(e.target.value)}></input><input type="radio" /></label>
                        <label>Deception (Cha): <input type="number" value={deception} onChange={e => setDeception(e.target.value)}></input><input type="radio" /></label>
                        <label>History (Int): <input type="number" value={history} onChange={e => setHistory(e.target.value)}></input><input type="radio" /></label>
                    </div>
                </div>
                <div className="skills">
                    <div classame="skillRow">
                        <label>Insight (Wis): <input type="number" value={insight} onChange={e => setInsight(e.target.value)}></input><input type="radio" /></label>
                        <label>Intimidation (Cha): <input type="number" value={intimidation} onChange={e => setIntimidation(e.target.value)}></input><input type="radio" /></label>
                        <label>Investigation (Int): <input type="number" value={investigation} onChange={e => setInvestigation(e.target.value)}></input><input type="radio" /></label>
                        <label>Medicine (Wis): <input type="number" value={medicine} onChange={e => setMedicine(e.target.value)}></input><input type="radio" /></label>
                        <label>Nature (Int): <input type="number" value={nature} onChange={e => setNature(e.target.value)}></input><input type="radio" /></label>
                        <label>Perception (Wis): <input type="number" value={perception} onChange={e => setPerception(e.target.value)}></input><input type="radio" /></label>
                    </div>
                </div>
                <div className="skills">
                    <div classame="skillRow">
                        <label>Performance (Cha): <input type="number" value={performance} onChange={e => setPerformance(e.target.value)}></input><input type="radio" /></label>
                        <label>Persuasion (Cha): <input type="number" value={persuasion} onChange={e => setPersuasion(e.target.value)}></input><input type="radio" /></label>
                        <label>Religion (Int): <input type="number" value={religion} onChange={e => setReligion(e.target.value)}></input><input type="radio" /></label>
                        <label>Sleight of Hand (Dex): <input type="number" value={sleightOfHand} onChange={e => setSleightOfHand(e.target.value)}></input><input type="radio" /></label>
                        <label>Stealth (Dex): <input type="number" value={stealth} onChange={e => setStealth(e.target.value)}></input><input type="radio" /></label>
                        <label>Survival (Wis): <input type="number" value={survival} onChange={e => setSurvival(e.target.value)}></input><input type="radio" /></label>
                    </div>
                </div>
                <textarea value={actions} onChange={e => setActions(e.target.value)} placeholder="Actions..."></textarea>
                <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="Features..."></textarea>
                <textarea value={profsLangs} onChange={e => setProfsLangs(e.target.value)} placeholder="Proficiencies & Languages..."></textarea>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes..."></textarea>
                <div className="charSpells">
                    <table>
                        <tbody>
                            <tr>
                                <th>Lvl</th>
                                <th>Name</th>
                                <th>Casting Time</th>
                                <th>Range</th>
                            </tr>
                            {spells.map((spell, index) => {
                                return <tr className="charSpell" key={spell.spell_id} onClick={() => viewSpell(spell)} style={{ cursor: 'pointer' }}><td>{spell.spell_level}</td><td>{spell.spell_name}</td><td>{formatCastingTime(spell.spell_time)}</td><td>{spell.spell_range}</td></tr>;
                            })}
                        </tbody>
                    </table>
                </div>
                <button onClick={saveChar}><FontAwesomeIcon icon={faSave} /> Save</button>
            </div>
        </div >
    )
}
