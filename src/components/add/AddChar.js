import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { saveNewChar } from '../../database/CharacterService';
import '../../assets/css/char/CharView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faAngleUp, faAngleDoubleUp, faMinus, faHeartBroken, faHeartbeat } from '@fortawesome/free-solid-svg-icons';

export default function CharView() {
    let historyRoute = useHistory();

    const [tabs, setTabs] = useState({ skills: true, combat: false, actions: false, features: false, spells: false, equipment: false, notes: false });

    const [name, setName] = useState("");
    const [player, setPlayer] = useState("");
    const [prof, setProf] = useState(0);
    const [level, setLevel] = useState(0);
    const [pic, setPic] = useState("");
    const [classes, setClasses] = useState("");
    const [race, setRace] = useState("");
    const [background, setBackground] = useState("");
    const [ac, setAc] = useState(0);
    const [hp, setHp] = useState(0);
    const [currentHp, setCurrentHp] = useState(0);
    const [hitDice, setHitDice] = useState("");
    const [init, setInit] = useState(0);
    const [speed, setSpeed] = useState("");
    const [inspiration, setInspiration] = useState(0);
    const [alignment, setAlignment] = useState("");

    const [str, setStr] = useState(0);
    const [dex, setDex] = useState(0);
    const [con, setCon] = useState(0);
    const [int, setInt] = useState(0);
    const [wis, setWis] = useState(0);
    const [cha, setCha] = useState(0);
    const [strSave, setStrSave] = useState(0);
    const [strSaveProf, setStrSaveProf] = useState(0);
    const [dexSave, setDexSave] = useState(0);
    const [dexSaveProf, setDexSaveProf] = useState(0);
    const [conSave, setConSave] = useState(0);
    const [conSaveProf, setConSaveProf] = useState(0);
    const [intSave, setIntSave] = useState(0);
    const [intSaveProf, setIntSaveProf] = useState(0);
    const [wisSave, setWisSave] = useState(0);
    const [wisSaveProf, setWisSaveProf] = useState(0);
    const [chaSave, setChaSave] = useState(0);
    const [chaSaveProf, setChaSaveProf] = useState(0);

    const [actions, setActions] = useState("");
    const [bonusActions, setBonusActions] = useState("");
    const [reactions, setReactions] = useState("");

    const [classFeatures, setClassFeatures] = useState("");
    const [racialFeatures, setRacialFeatures] = useState("");
    const [features, setFeatures] = useState("");

    const [profsLangs, setProfsLangs] = useState("");
    const [senses, setSenses] = useState("");
    const [passivPerception, setPassivPerception] = useState(0);
    const [passivInsight, setPassivInsight] = useState(0);
    const [passivInvestigation, setPassivInvestigation] = useState(0);

    const [notesOne, setNotesOne] = useState("");
    const [notesTwo, setNotesTwo] = useState("");
    const [notesThree, setNotesThree] = useState("");

    const [acrobatics, setAcrobatics] = useState(0);
    const [acrobaticsProf, setAcrobaticsProf] = useState(0);
    const [animalHandling, setAnimalHandling] = useState(0);
    const [animalHandlingProf, setAnimalHandlingProf] = useState(0);
    const [arcana, setArcana] = useState(0);
    const [arcanaProf, setArcanaProf] = useState(0);
    const [athletics, setAthletics] = useState(0);
    const [athleticsProf, setAthleticsProf] = useState(0);
    const [deception, setDeception] = useState(0);
    const [deceptionProf, setDeceptionProf] = useState(0);
    const [history, setHistory] = useState(0);
    const [historyProf, setHistoryProf] = useState(0);
    const [insight, setInsight] = useState(0);
    const [insightProf, setInsightProf] = useState(0);
    const [intimidation, setIntimidation] = useState(0);
    const [intimidationProf, setIntimidationProf] = useState(0);
    const [investigation, setInvestigation] = useState(0);
    const [investigationProf, setInvestigationProf] = useState(0);
    const [medicine, setMedicine] = useState(0);
    const [medicineProf, setMedicineProf] = useState(0);
    const [nature, setNature] = useState(0);
    const [natureProf, setNatureProf] = useState(0);
    const [perception, setPerception] = useState(0);
    const [perceptionProf, setPerceptionProf] = useState(0);
    const [performance, setPerformance] = useState(0);
    const [performanceProf, setPerformanceProf] = useState(0);
    const [persuasion, setPersuasion] = useState(0);
    const [persuasionProf, setPersuasionProf] = useState(0);
    const [religion, setReligion] = useState(0);
    const [religionProf, setReligionProf] = useState(0);
    const [sleightOfHand, setSleightOfHand] = useState(0);
    const [sleightOfHandProf, setSleightOfHandProf] = useState(0);
    const [stealth, setStealth] = useState(0);
    const [stealthProf, setStealthProf] = useState(0);
    const [survival, setSurvival] = useState(0);
    const [survivalProf, setSurvivalProf] = useState(0);

    const [spellNotes, setSpellNotes] = useState("Spellslots for example?");
    const [castingHit, setCastingHit] = useState(0);
    const [castingDC, setCastingDC] = useState(0);

    useEffect(() => {
        if(level<5) {
            setProf(2);
        } else if(level<9) {
            setProf(3);
        }else if(level<13) {
            setProf(4);
        }else if(level<17) {
            setProf(5);
        }else if(level<21) {
            setProf(6);
        }
    }, [level]);
    useEffect(() => {
        setStrSave(parseInt(formatScore(str), 10) + (strSaveProf * prof));
        setAthletics(parseInt(formatScore(str), 10) + (athleticsProf * prof));
    }, [prof, str, strSaveProf, athleticsProf]);
    useEffect(() => {
        setDexSave(parseInt(formatScore(dex), 10) + (dexSaveProf * prof));
        setAcrobatics(parseInt(formatScore(dex), 10) + (acrobaticsProf * prof));
        setSleightOfHand(parseInt(formatScore(dex), 10) + (sleightOfHandProf * prof));
        setStealth(parseInt(formatScore(dex), 10) + (stealthProf * prof));

        setInit(parseInt(formatScore(dex), 10));
    }, [prof, dex, dexSaveProf, acrobaticsProf, sleightOfHandProf, stealthProf]);
    useEffect(() => {
        setConSave(parseInt(formatScore(con), 10) + (conSaveProf * prof));
    }, [prof, con, conSaveProf]);
    useEffect(() => {
        setIntSave(parseInt(formatScore(int), 10) + (intSaveProf * prof));
        setArcana(parseInt(formatScore(int), 10) + (arcanaProf * prof));
        setHistory(parseInt(formatScore(int), 10) + (historyProf * prof));
        setInvestigation(parseInt(formatScore(int), 10) + (investigationProf * prof));
        setNature(parseInt(formatScore(int), 10) + (natureProf * prof));
        setReligion(parseInt(formatScore(int), 10) + (religionProf * prof));

        setPassivInvestigation(parseInt(formatScore(int), 10) + (investigationProf * prof) + 10);
    }, [prof, int, intSaveProf, arcanaProf, historyProf, investigationProf, natureProf, religionProf]);
    useEffect(() => {
        setWisSave(parseInt(formatScore(wis), 10) + (wisSaveProf * prof));
        setAnimalHandling(parseInt(formatScore(wis), 10) + (animalHandlingProf * prof));
        setInsight(parseInt(formatScore(wis), 10) + (insightProf * prof));
        setMedicine(parseInt(formatScore(wis), 10) + (medicineProf * prof));
        setPerception(parseInt(formatScore(wis), 10) + (perceptionProf * prof));
        setSurvival(parseInt(formatScore(wis), 10) + (survivalProf * prof));

        setPassivPerception(parseInt(formatScore(wis), 10) + (perceptionProf * prof) + 10);
        setPassivInsight(parseInt(formatScore(wis), 10) + (insightProf * prof) + 10);
    }, [prof, wis, wisSaveProf, animalHandlingProf, insightProf, medicineProf, perceptionProf, survivalProf]);
    useEffect(() => {
        setChaSave(parseInt(formatScore(cha), 10) + (chaSaveProf * prof));
        setDeception(parseInt(formatScore(cha), 10) + (deceptionProf * prof));
        setIntimidation(parseInt(formatScore(cha), 10) + (intimidationProf * prof));
        setPerformance(parseInt(formatScore(cha), 10) + (performanceProf * prof));
        setPersuasion(parseInt(formatScore(cha), 10) + (persuasionProf * prof));
    }, [prof, cha, chaSaveProf, deceptionProf, intimidationProf, performanceProf, persuasionProf]);

    const formatScore = (score) => {
        let mod = Math.floor((score - 10) / 2);
        if (mod >= 0) {
            return "+" + mod;
        } else {
            return mod;
        }
    }

    const saveChar = () => {
        saveNewChar({
            name, player, prof, level, pic, classes, race, background, ac, hp, currentHp, hitDice,
            init, speed, str, dex, con, int, wis, cha, strSave, dexSave, conSave, intSave, wisSave, chaSave,
            strSaveProf, dexSaveProf, conSaveProf, intSaveProf, wisSaveProf, chaSaveProf,
            actions, bonusActions, reactions, features, classFeatures, racialFeatures, profsLangs,
            senses, passivPerception, passivInsight, passivInvestigation,
            notesOne, notesTwo, notesThree, acrobatics, animalHandling, arcana,
            athletics, deception, history, insight, intimidation, investigation, medicine, nature,
            perception, performance, persuasion, religion, sleightOfHand, stealth, survival,
            acrobaticsProf, animalHandlingProf, arcanaProf,
            athleticsProf, deceptionProf, historyProf, insightProf, intimidationProf, investigationProf, medicineProf, natureProf,
            perceptionProf, performanceProf, persuasionProf, religionProf, sleightOfHandProf, stealthProf, survivalProf, spellNotes,
            alignment, inspiration, castingHit, castingDC
        });
        historyRoute.push("/char-overview");
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

    const changeIcon = (value) => {
        if (value === undefined || value === 0) {
            return faMinus;
        } else if (value === 1) {
            return faAngleUp;
        } else {
            return faAngleDoubleUp;
        }
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
                    <label>Class:<input name="class" type="text" value={classes} onChange={e => setClasses(e.target.value)} /></label><br />
                    <label className="checkbox-label">
                        <div className="labelText">Inspiration:</div>
                        <input name="type" type="checkbox" checked={inspiration} onChange={e => setInspiration(e.target.checked)} />
                        <span className="checkbox-custom circular"></span>
                    </label>
                </div>
                <div className="smallLabelGroup">
                    <label>Level:<input name="level" type="number" value={level} onChange={e => setLevel(e.target.value)} /></label><br />
                    <label>Race:<input name="race" type="text" value={race} onChange={e => setRace(e.target.value)} /></label><br />
                    <label>Background:<input name="background" type="text" value={background} onChange={e => setBackground(e.target.value)} /></label><br />
                    <label>Proficiency:<input name="level" type="number" value={prof} onChange={e => setProf(e.target.value)} /></label><br />
                    <label>Alignment:<input name="alignment" type="text" value={alignment} onChange={e => setAlignment(e.target.value)} /></label>
                </div>
                <button onClick={saveChar}><FontAwesomeIcon icon={faSave} /> Create</button>
                <div className="tabComponent">
                    <div className="tabSelector">
                        <div className={`tabName ${tabs.skills ? "active" : ""}`} onClick={e => showTab(0)}>Attributes/Skills</div>
                        <div className={`tabName ${tabs.combat ? "active" : ""}`} onClick={e => showTab(1)}>Combat</div>
                        <div className={`tabName ${tabs.actions ? "active" : ""}`} onClick={e => showTab(2)}>Actions</div>
                        <div className={`tabName ${tabs.features ? "active" : ""}`} onClick={e => showTab(3)}>Features</div>
                        <div className={`tabName ${tabs.spells ? "active" : ""}`} onClick={e => showTab(4)}>Spells</div>
                        <div className={`tabName ${tabs.notes ? "active" : ""}`} onClick={e => showTab(6)}>Notes</div>
                    </div>
                    <div className="tabs">
                        <div className="tabContent" style={{ display: tabs.combat ? "flex" : "none" }}>
                            <div className="smallLabelGroup">
                                <label>HP:<input name="hp" type="number" value={hp} onChange={e => setHp(e.target.value)} /></label><br />
                                <label>Current Hp:<input name="currentHP" type="number" value={currentHp} onChange={e => setCurrentHp(e.target.value)} /></label><br />
                                <label>Hit Dice:<input name="hitDice" type="text" value={hitDice} onChange={e => setHitDice(e.target.value)} /></label>
                            </div>
                            <div className="smallLabelGroup">
                                <label>Armor Class:<input name="ac" type="number" value={ac} onChange={e => setAc(e.target.value)} /></label><br />
                                <label>Initiative:<input name="initiativ" type="number" value={init} onChange={e => setInit(e.target.value)} /></label><br />
                                <textarea className="small slim" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="Speed..."></textarea>
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
                                <label>Str Save: <input type="number" value={strSave} onChange={e => setStrSave(e.target.value)} />
                                    <FontAwesomeIcon className="profToggler" icon={changeIcon(strSaveProf)} onClick={e => setStrSaveProf((strSaveProf + 1) % 2)} /></label>
                                <label>Dex Save: <input type="number" value={dexSave} onChange={e => setDexSave(e.target.value)} />
                                    <FontAwesomeIcon className="profToggler" icon={changeIcon(dexSaveProf)} onClick={e => setDexSaveProf((dexSaveProf + 1) % 2)} /></label>
                                <label>Con Save: <input type="number" value={conSave} onChange={e => setConSave(e.target.value)} />
                                    <FontAwesomeIcon className="profToggler" icon={changeIcon(conSaveProf)} onClick={e => setConSaveProf((conSaveProf + 1) % 2)} /></label>
                                <label>Int Save: <input type="number" value={intSave} onChange={e => setIntSave(e.target.value)} />
                                    <FontAwesomeIcon className="profToggler" icon={changeIcon(intSaveProf)} onClick={e => setIntSaveProf((intSaveProf + 1) % 2)} /></label>
                                <label>Wis Save: <input type="number" value={wisSave} onChange={e => setWisSave(e.target.value)} />
                                    <FontAwesomeIcon className="profToggler" icon={changeIcon(wisSaveProf)} onClick={e => setWisSaveProf((wisSaveProf + 1) % 2)} /></label>
                                <label>Cha Save: <input type="number" value={chaSave} onChange={e => setChaSave(e.target.value)} />
                                    <FontAwesomeIcon className="profToggler" icon={changeIcon(chaSaveProf)} onClick={e => setChaSaveProf((chaSaveProf + 1) % 2)} /></label>
                            </div>
                            <div className="skills">
                                <div classame="skillRow">
                                    <label>Acrobatics (Dex): <input type="number" value={acrobatics} onChange={e => setAcrobatics(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(acrobaticsProf)} onClick={e => setAcrobaticsProf((acrobaticsProf + 1) % 3)} /></label>
                                    <label>Animal Handling (Wis): <input type="number" value={animalHandling} onChange={e => setAnimalHandling(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(animalHandlingProf)} onClick={e => setAnimalHandlingProf((animalHandlingProf + 1) % 3)} /></label>
                                    <label>Arcana (Int): <input type="number" value={arcana} onChange={e => setArcana(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(arcanaProf)} onClick={e => setArcanaProf((arcanaProf + 1) % 3)} /></label>
                                    <label>Athletics (Str): <input type="number" value={athletics} onChange={e => setAthletics(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(athleticsProf)} onClick={e => setAthleticsProf((athleticsProf + 1) % 3)} /></label>
                                    <label>Deception (Cha): <input type="number" value={deception} onChange={e => setDeception(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(deceptionProf)} onClick={e => setDeceptionProf((deceptionProf + 1) % 3)} /></label>
                                    <label>History (Int): <input type="number" value={history} onChange={e => setHistory(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(historyProf)} onClick={e => setHistoryProf((historyProf + 1) % 3)} /></label>
                                </div>
                            </div>
                            <div className="skills">
                                <div classame="skillRow">
                                    <label>Insight (Wis): <input type="number" value={insight} onChange={e => setInsight(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(insightProf)} onClick={e => setInsightProf((insightProf + 1) % 3)} /></label>
                                    <label>Intimidation (Cha): <input type="number" value={intimidation} onChange={e => setIntimidation(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(intimidationProf)} onClick={e => setIntimidationProf((intimidationProf + 1) % 3)} /></label>
                                    <label>Investigation (Int): <input type="number" value={investigation} onChange={e => setInvestigation(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(investigationProf)} onClick={e => setInvestigationProf((investigationProf + 1) % 3)} /></label>
                                    <label>Medicine (Wis): <input type="number" value={medicine} onChange={e => setMedicine(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(medicineProf)} onClick={e => setMedicineProf((medicineProf + 1) % 3)} /></label>
                                    <label>Nature (Int): <input type="number" value={nature} onChange={e => setNature(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(natureProf)} onClick={e => setNatureProf((natureProf + 1) % 3)} /></label>
                                    <label>Perception (Wis): <input type="number" value={perception} onChange={e => setPerception(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(perceptionProf)} onClick={e => setPerceptionProf((perceptionProf + 1) % 3)} /></label>
                                </div>
                            </div>
                            <div className="skills">
                                <div classame="skillRow">
                                    <label>Performance (Cha): <input type="number" value={performance} onChange={e => setPerformance(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(performanceProf)} onClick={e => setPerformanceProf((performanceProf + 1) % 3)} /></label>
                                    <label>Persuasion (Cha): <input type="number" value={persuasion} onChange={e => setPersuasion(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(persuasionProf)} onClick={e => setPersuasionProf((persuasionProf + 1) % 3)} /></label>
                                    <label>Religion (Int): <input type="number" value={religion} onChange={e => setReligion(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(religionProf)} onClick={e => setReligionProf((religionProf + 1) % 3)} /></label>
                                    <label>Sleight of Hand (Dex): <input type="number" value={sleightOfHand} onChange={e => setSleightOfHand(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(sleightOfHandProf)} onClick={e => setSleightOfHandProf((sleightOfHandProf + 1) % 3)} /></label>
                                    <label>Stealth (Dex): <input type="number" value={stealth} onChange={e => setStealth(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(stealthProf)} onClick={e => setStealthProf((stealthProf + 1) % 3)} /></label>
                                    <label>Survival (Wis): <input type="number" value={survival} onChange={e => setSurvival(e.target.value)} />
                                        <FontAwesomeIcon className="profToggler" icon={changeIcon(survivalProf)} onClick={e => setSurvivalProf((survivalProf + 1) % 3)} /></label>
                                </div>
                            </div>
                            <div className="smallLabelGroup">
                                <label>Passive Perception:<input name="passivPerception" type="number" value={passivPerception} onChange={e => setPassivPerception(e.target.value)} /></label><br />
                                <label>Passive Insight:<input name="passivInsight" type="number" value={passivInsight} onChange={e => setPassivInsight(e.target.value)} /></label><br />
                                <label>Passive Invenstigation:<input name="passivInvestigation" type="number" value={passivInvestigation} onChange={e => setPassivInvestigation(e.target.value)} /></label><br />
                                <textarea className="small" value={senses} onChange={e => setSenses(e.target.value)} placeholder="Senses..."></textarea>
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
                            <textarea className="big" value={spellNotes} onChange={e => setSpellNotes(e.target.value)} placeholder="Spell Notes..."></textarea>
                        </div>
                        <div className="tabContent" style={{ display: tabs.notes ? "flex" : "none" }}>
                            <textarea className="big" value={notesOne} onChange={e => setNotesOne(e.target.value)} placeholder="Notes..."></textarea>
                            <textarea className="big" value={notesTwo} onChange={e => setNotesTwo(e.target.value)} placeholder="Notes..."></textarea>
                            <textarea className="big" value={notesThree} onChange={e => setNotesThree(e.target.value)} placeholder="Notes..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
