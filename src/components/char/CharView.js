import React, { useState, useEffect, useCallback } from 'react';
import '../../assets/css/char/CharView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import StatChart from './StatChart';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function CharView(props) {
    const [tabs, setTabs] = useState({ skills: true, combat: false, actions: false, features: false, spells: false, equipment: false, notes: false });

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
    const [bonusActions, setBonusActions] = useState("");
    const [reactions, setReactions] = useState("");

    const [classFeatures, setClassFeatures] = useState("");
    const [racialFeatures, setRacialFeatures] = useState("");
    const [features, setFeatures] = useState("");

    const [profsLangs, setProfsLangs] = useState("");

    const [notesOne, setNotesOne] = useState("");
    const [notesTwo, setNotesTwo] = useState("");
    const [notesThree, setNotesThree] = useState("");

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

    const [spellNotes, setSpellNotes] = useState("");
    const [spells, setSpells] = useState([]);
    const [items, setItems] = useState([]);

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
        setBonusActions(result.char_bonusActions);
        setReactions(result.char_reactions);

        setClassFeatures(result.char_classFeatures);
        setRacialFeatures(result.char_racialFeatures);
        setFeatures(result.char_features);

        setProfsLangs(result.char_profs_langs);

        setNotesOne(result.char_notesOne);
        setNotesTwo(result.char_notesTwo);
        setNotesThree(result.char_notesThree);

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

        setSpellNotes(result.char_spellNotes);
    }

    const receiveSpells = (event, result) => {
        setSpells(result);
    }
    const receiveItems = (event, result) => {
        setItems(result);
    }

    useEffect(() => {
        ipcRenderer.send('getChar', { id: props.match.params.id });
        ipcRenderer.on("getCharResult", receiveChar);
        ipcRenderer.send('getCharSpells', { id: props.match.params.id });
        ipcRenderer.on("getCharSpellsResult", receiveSpells);
        ipcRenderer.send('getCharItems', { id: props.match.params.id });
        ipcRenderer.on("getCharItemsResult", receiveItems);
        return () => {
            ipcRenderer.removeListener("getCharResult", receiveChar)
            ipcRenderer.removeListener("getCharSpellsResult", receiveSpells);
            ipcRenderer.removeListener("getCharItemsResult", receiveItems);
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

    const formatLevel = (value) => {
        if (value == "0") {
            return "C";
        }
        return value;
    }

    const formatCastingTime = (value) => {
        let words = value.split(',');
        return words[0];
    }

    const viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }
    const viewItem = (item) => {
        ipcRenderer.send('openItemView', item);
    }

    const deleteCharSpell = (spell) => {
        ipcRenderer.send('deleteCharSpell', {spell: spell});
    }
    const deleteCharItem = (item) => {
        ipcRenderer.send('deleteCharItem', {item: item});
    }

    const saveChar = (spell) => {
        ipcRenderer.send('saveChar', {
            char: {
                id, name, player, prof, exp, pic, classes, race, background, ac, hp, currentHp,
                init, str, dex, con, int, wis, cha, strSave, dexSave, conSave, intSave, wisSave, chaSave,
                actions, bonusActions, reactions, features, classFeatures, racialFeatures, profsLangs,
                notesOne, notesTwo, notesThree, acrobatics, animalHandling, arcana,
                athletics, deception, history, insight, intimidation, investigation, medicine, nature,
                perception, performance, persuasion, religion, sleightOfHand, stealth, survival, spellNotes
            }
        });
        ipcRenderer.send('saveCharItems', {
            items: items
        });
        ipcRenderer.send('saveCharSpells', {
            spells: spells
        });
    }

    const showTab = (tab) => {
        if (tab === 0) {
            setTabs({ skills: true, combat: false, actions: false, features: false, spells: false, equipment: false, notes: false });
        } else if (tab === 1) {
            setTabs({ skills: false, combat: true, actions: false, features: false, spells: false, equipment: false, notes: false });
        } else if (tab === 2) {
            setTabs({ skills: false, combat: false, actions: true, features: false, spells: false, equipment: false, notes: false });
        } else if (tab === 3) {
            setTabs({ skills: false, combat: false, actions: false, features: true, spells: false, equipment: false, notes: false });
        } else if (tab === 4) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: true, equipment: false, notes: false });
        } else if (tab === 5) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: false, equipment: true, notes: false });
        } else if (tab === 6) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: false, equipment: false, notes: true });
        }
    }

    const createValueListenerItem = useCallback((item, fieldName) => e => {
        const allItemsWithChangedSingleItem = items.map(editItem => {
            if (item === editItem) {
                return { ...item, [fieldName]: e.target.value };
            }
            return editItem;
        })
        setItems(allItemsWithChangedSingleItem);
    }, [items, setItems]);
    const createCheckedListenerItem = useCallback((item, fieldName) => e => {
        const allItemsWithChangedSingleItem = items.map(editItem => {
            if (item === editItem) {
                return { ...item, [fieldName]: e.target.checked };
            }
            return editItem;
        })
        setItems(allItemsWithChangedSingleItem);
    }, [items, setItems]);
    const createCheckedListenerSpell = useCallback((spell, fieldName) => e => {
        const allItemsWithChangedSingleSpell = spells.map(editSpell => {
            if (spell === editSpell) {
                return { ...spell, [fieldName]: e.target.checked };
            }
            return editSpell;
        })
        setSpells(allItemsWithChangedSingleSpell);
    }, [spells, setSpells]);

    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    const data = [
        {
            subject: 'Str', A: str, fullMark: 40,
        },
        {
            subject: 'Dex', A: dex, fullMark: 40,
        },
        {
            subject: 'Con', A: con, fullMark: 40,
        },
        {
            subject: 'Int', A: int, fullMark: 40,
        },
        {
            subject: 'Wis', A: wis, fullMark: 40,
        },
        {
            subject: 'Cha', A: cha, fullMark: 40,
        },
    ];


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
                    <StatChart data={data} />
                </div>
                <button onClick={saveChar}><FontAwesomeIcon icon={faSave} /> Save</button>
                <div className="tabComponent">
                    <div className="tabSelector">
                        <div className={`tabName ${tabs.skills ? "active" : ""}`} onClick={e => showTab(0)}>Attributes/Skills</div>
                        <div className={`tabName ${tabs.combat ? "active" : ""}`} onClick={e => showTab(1)}>Combat</div>
                        <div className={`tabName ${tabs.actions ? "active" : ""}`} onClick={e => showTab(2)}>Actions</div>
                        <div className={`tabName ${tabs.features ? "active" : ""}`} onClick={e => showTab(3)}>Features</div>
                        <div className={`tabName ${tabs.spells ? "active" : ""}`} onClick={e => showTab(4)}>Spells</div>
                        <div className={`tabName ${tabs.equipment ? "active" : ""}`} onClick={e => showTab(5)}>Equipment</div>
                        <div className={`tabName ${tabs.notes ? "active" : ""}`} onClick={e => showTab(6)}>Notes</div>
                    </div>
                    <div className="tabs">
                        <div className="tabContent" style={{ display: tabs.combat ? "flex" : "none" }}>
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
                        </div>
                        <div className="tabContent" style={{ display: tabs.skills ? "flex" : "none" }}>
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
                            <textarea value={profsLangs} onChange={e => setProfsLangs(e.target.value)} placeholder="Proficiencies & Languages..."></textarea>
                        </div>
                        <div className="tabContent" style={{ display: tabs.actions ? "flex" : "none" }}>
                            <textarea className="big" value={actions} onChange={e => setActions(e.target.value)} placeholder="Actions..."></textarea>
                            <textarea className="big" value={bonusActions} onChange={e => setBonusActions(e.target.value)} placeholder="Bonus actions..."></textarea>
                            <textarea className="big" value={reactions} onChange={e => setReactions(e.target.value)} placeholder="Reactions..."></textarea>
                        </div>
                        <div className="tabContent" style={{ display: tabs.features ? "flex" : "none" }}>
                            <textarea className="big" value={classFeatures} onChange={e => setClassFeatures(e.target.value)} placeholder="Class features..."></textarea>
                            <textarea className="big" value={racialFeatures} onChange={e => setRacialFeatures(e.target.value)} placeholder="Racial features..."></textarea>
                            <textarea className="big" value={features} onChange={e => setFeatures(e.target.value)} placeholder="Feats..."></textarea>
                        </div>
                        <div className="tabContent" style={{ display: tabs.spells ? "flex" : "none" }}>
                            <div className="charSpells">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Lvl</th>
                                            <th>Name</th>
                                            <th>Casting Time</th>
                                            <th>Range</th>
                                            <th>Prepared?</th>
                                            <th>Remove</th>
                                        </tr>
                                        {spells.map((spell, index) => {
                                            return <tr className="charSpell" key={spell.spell_id} style={{ cursor: 'pointer' }}>
                                                <td onClick={() => viewSpell(spell)}>{formatLevel(spell.spell_level)}</td>
                                                <td onClick={() => viewSpell(spell)}>{spell.spell_name}</td>
                                                <td onClick={() => viewSpell(spell)}>{formatCastingTime(spell.spell_time)}</td>
                                                <td onClick={() => viewSpell(spell)}>{spell.spell_range}</td>
                                                <td className="centered"><input name="prepared" type="checkbox" checked={spell.spell_prepared} onChange={createCheckedListenerSpell(spell, "spell_prepared")} /></td>
                                                <td onClick={() => deleteCharSpell(spell)} className="centered removeIcon"><FontAwesomeIcon icon={faTimes} /></td>
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <textarea className="big" value={spellNotes} onChange={e => setSpellNotes(e.target.value)} placeholder="Spell Notes..."></textarea>
                        </div>
                        <div className="tabContent" style={{ display: tabs.equipment ? "flex" : "none" }}>
                            <div className="charItems">
                                <table className="itemTable">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Equiped?</th>
                                            <th>Attuned?</th>
                                            <th>Remove</th>
                                        </tr>
                                        {items.map((item, index) => {
                                            return <tr className="charItem" key={item.id} style={{ cursor: 'pointer' }}>
                                                <td onClick={() => viewItem(item)}>{item.item_name}</td>
                                                <td onClick={() => viewItem(item)}>{item.item_type}</td>
                                                <td className="centered"><input type="number" value={item.item_amount} onChange={createValueListenerItem(item, "item_amount")} /></td>
                                                <td className="centered"><input name="equiped" type="checkbox" checked={item.item_equiped} onChange={createCheckedListenerItem(item, "item_equiped")} /></td>
                                                <td className="centered"><input name="attuned" type="checkbox" checked={item.item_attuned} onChange={createCheckedListenerItem(item, "item_attuned")} /></td>
                                                <td onClick={() => deleteCharItem(item)} className="centered removeIcon"><FontAwesomeIcon icon={faTimes} /></td>
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="tabContent" style={{ display: tabs.notes ? "flex" : "none" }}>
                            <textarea value={notesOne} onChange={e => setNotesOne(e.target.value)} placeholder="Notes..."></textarea>
                            <textarea value={notesTwo} onChange={e => setNotesTwo(e.target.value)} placeholder="Notes..."></textarea>
                            <textarea value={notesThree} onChange={e => setNotesThree(e.target.value)} placeholder="Notes..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
