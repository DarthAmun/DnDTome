import React, { useState, useEffect, useCallback } from 'react';
import * as ReactDOM from "react-dom";
import { useHistory } from 'react-router-dom';
import '../../assets/css/char/CharView.css';
import OptionService from '../../database/OptionService';
import ThemeService from '../../services/ThemeService';
import PdfFillerService from '../../services/PdfFillerService';
import { saveChar, saveCharItems, saveCharSpells, deleteChar, deleteCharItem, deleteCharMonster, reciveChar, reciveCharSpells, reciveCharMonsters, reciveCharItems, deleteCharSpell } from '../../database/CharacterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faAngleUp, faAngleDoubleUp, faMinus, faHeartBroken, faHeartbeat, faTrashAlt, faFileExport, faPrint } from '@fortawesome/free-solid-svg-icons';
import StatChart from './StatChart';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog, app } = electron.remote;
const fs = require('fs');


export default function CharView(props) {
    let historyRoute = useHistory();

    const [tabs, setTabs] = useState({ skills: true, combat: false, actions: false, features: false, spells: false, equipment: false, monsters: false, notes: false });

    const [id, setId] = useState(0);
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

    const [spellNotes, setSpellNotes] = useState("");
    const [spells, setSpells] = useState([]);
    const [castingHit, setCastingHit] = useState(0);
    const [castingDC, setCastingDC] = useState(0);

    const [items, setItems] = useState([]);
    const [monsters, setMonsters] = useState([]);

    const [lifeOne, setLifeOne] = useState(0);
    const [lifeTwo, setLifeTwo] = useState(0);
    const [lifeThree, setLifeThree] = useState(0);
    const [deathOne, setDeathOne] = useState(0);
    const [deathTwo, setDeathTwo] = useState(0);
    const [deathThree, setDeathThree] = useState(0);

    const receiveCharResult = (result) => {
        console.time("receiveChar")
        ReactDOM.unstable_batchedUpdates(() => {
            setName(result.char_name);
            setId(result.char_id);
            setPlayer(result.char_player);
            setPic(result.char_pic);
            setProf(result.char_prof);
            setLevel(result.char_level);
            setClasses(result.char_classes);
            setRace(result.char_race);
            setBackground(result.char_background);
            setAc(result.char_ac);
            setHp(result.char_hp);
            setCurrentHp(result.char_hp_current);
            setHitDice(result.char_hitDice);
            setInit(result.char_init);
            setSpeed(result.char_speed);
            setInspiration(result.char_inspiration);
            setAlignment(result.char_alignment);

            setStr(result.char_str);
            setDex(result.char_dex);
            setCon(result.char_con);
            setInt(result.char_int);
            setWis(result.char_wis);
            setCha(result.char_cha);
            setStrSave(result.char_strSave);
            setStrSaveProf(result.char_strSaveProf);
            setDexSave(result.char_dexSave);
            setDexSaveProf(result.char_dexSaveProf);
            setConSave(result.char_conSave);
            setConSaveProf(result.char_conSaveProf);
            setIntSave(result.char_intSave);
            setIntSaveProf(result.char_intSaveProf);
            setWisSave(result.char_wisSave);
            setWisSaveProf(result.char_wisSaveProf);
            setChaSave(result.char_chaSave);
            setChaSaveProf(result.char_chaSaveProf);

            setActions(result.char_actions);
            setBonusActions(result.char_bonusActions);
            setReactions(result.char_reactions);

            setClassFeatures(result.char_classFeatures);
            setRacialFeatures(result.char_racialFeatures);
            setFeatures(result.char_features);

            setProfsLangs(result.char_profs_langs);
            setSenses(result.char_senses);
            setPassivPerception(result.char_passivPerception);
            setPassivInsight(result.char_passivInsight);
            setPassivInvestigation(result.char_passivInvestigation);

            setNotesOne(result.char_notesOne);
            setNotesTwo(result.char_notesTwo);
            setNotesThree(result.char_notesThree);

            setAcrobaticsProf(result.char_acrobaticsProf);
            setAnimalHandlingProf(result.char_animalHandlingProf);
            setArcanaProf(result.char_arcanaProf);
            setAthleticsProf(result.char_athleticsProf);
            setDeceptionProf(result.char_deceptionProf);
            setHistoryProf(result.char_historyProf);
            setInsightProf(result.char_insightProf);
            setIntimidationProf(result.char_intimidationProf);
            setInvestigationProf(result.char_investigationProf);
            setMedicineProf(result.char_medicineProf);
            setNatureProf(result.char_natureProf);
            setPerceptionProf(result.char_perceptionProf);
            setPerformanceProf(result.char_performanceProf);
            setPersuasionProf(result.char_persuasionProf);
            setReligionProf(result.char_religionProf);
            setSleightOfHandProf(result.char_sleightOfHandProf);
            setStealthProf(result.char_stealthProf);
            setSurvivalProf(result.char_survivalProf);
            
            setCastingHit(result.char_castingHit);
            setCastingDC(result.char_castingDC);
            setSpellNotes(result.char_spellNotes);
        });
        ReactDOM.unstable_batchedUpdates(() => {
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
        });
        console.timeEnd("receiveChar")
    }

    const receiveSpellsResult = (result) => {
        setSpells(result);
    }
    const receiveItemsResult = (result) => {
        setItems(result);
    }
    const reciveMonstersResult = (result) => {
        setMonsters(result);
    }

    useEffect(() => {
        OptionService.get('theme', function (result) {
            ThemeService.setTheme(result);
            ThemeService.applyTheme(result);
        });

        reciveChar(props.match.params.id, function (result) {
            receiveCharResult(result);
        })
        reciveCharSpells(props.match.params.id, function (result) {
            receiveSpellsResult(result);
        })
        reciveCharMonsters(props.match.params.id, function (result) {
            reciveMonstersResult(result);
        })
        reciveCharItems(props.match.params.id, function (result) {
            receiveItemsResult(result);
        })
    }, []);

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

    const options = {
        defaultPath: app.getPath('documents')
    }

    const makeCards = () => {
        let cards = `<html><head><title>Cards</title><style>@media print { div{ page-break-inside: avoid; }} .card { height: 88mm; width: 63mm; margin: 5px; border: 1px solid darkgrey; border-radius: 5px; float: left; font-family: Arial, Helvetica, sans-serif;} /* HEAD */ .head{ height: 15mm; width: 100%; float: left; margin-top: 1mm; position: relative; z-index: 1; } .level { width: 10mm; height: 10mm; float:left; margin-left: 1mm; margin-top: -1mm; line-height: 12mm; text-align: center; background-color: white; font-size: 20px; position: relative; box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.50); } .level:after { top: 100%; left: 50%; border: solid transparent; content: ' '; height: 0; width: 0; position: absolute; pointer-events: none; border-color: rgba(136, 183, 213, 0); border-top-color: white; border-width: 5mm; margin-left: -5mm; } .level:before { content: ''; position: absolute; transform: rotate(45deg); width: 7mm; height: 7mm; bottom: -15px; margin-left: -8px; z-index: -1; box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.50); } .name { float: left; width: calc(100% - 30mm); height: 10mm; padding-top: 2mm; padding-right: 2mm; padding-left: 2mm; background-color: white; text-align: center; font-size: 14px;} .school { float: right; height: 12mm; width: 12mm; margin-right: 1mm; background-color:white; border: 2px darkgrey; border-style: solid dashed solid dashed; border-radius: 8mm; line-height: 12mm; text-align: center; } /* ATTRIBUTES */ .spellAttributes { width: 100%; height: 5mm; float: left; font-size: 9px; text-align: center; line-height: 3mm;} .spellAttributes div { display: inline-block; } .spellAttributes div:after { white-space: pre; content: " | "; } .spellAttributes div:last-child:after { content: ''; } /* TEXT */ .text { width: calc(100% - 10px); height: auto; max-height: 62mm; float:left; padding-left: 5px; padding-right: 5px; overflow: hidden; font-size: 8px; } hr.seperator { border: 0; height: 1px; background-image: -webkit-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); background-image: -moz-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); background-image: -ms-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); background-image: -o-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); float: left; width: calc(100% - 50px); margin-left: 25px; margin-right: 25px; } hr.seperatorSmall { border: 0; height: 1px; background-image: -webkit-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); background-image: -moz-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); background-image: -ms-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); background-image: -o-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); float: left; width: calc(100% - 100px); margin-left: 50px; margin-right: 50px; margin-top: -11px; } .square { transform: rotate(45deg); width: 1mm; height: 1mm; background-color: lightgray; margin-bottom: 1mm; margin-left: auto; margin-right: auto; }</style></head><body>`;
        spells.forEach(spell => {
            cards = cards + `<div class="card"><div class="head"><div class="level">${formatLevel(spell.spell_level)}</div><div class="name">${spell.spell_name}</div><div class="school">${spell.spell_school.substring(0, 3)}</div></div><hr class="seperatorSmall"><div class="spellAttributes"><div>${spell.spell_time}</div><div>${spell.spell_range}</div><div>${spell.spell_duration}</div><div>${spell.spell_components}</div></div><hr class="seperator"><div class="text"><p>${spell.spell_text.replace("\\n", "</p><p>")}</p><div class="square"></div></div></div>`;
        });
        cards = cards + '</body></html>';
        return cards;
    }

    const levelortSpells = () => {
        let content = makeCards();
        options.defaultPath = options.defaultPath + `/${name}_spellCards.html`;
        dialog.showSaveDialog(null, options, (path) => {

            // fileName is a string that contains the path and filename created in the save file dialog.  
            fs.writeFile(path, content, (err) => {
                if (err) {
                    ipcRenderer.send('displayMessage', { type: `Spellcards levelorted`, message: `Spellcards failed` });
                }
                ipcRenderer.send('displayMessage', { type: `Spellcards levelorted`, message: `Spellcards successful` });
            });
        });
    }

    const printChar = () => {
        let sourcePDF = app.getAppPath() + './src/assets/pdf/character_sheet_template.pdf';
        options.defaultPath = options.defaultPath + `/${name}_character.pdf`;
        let log = options.defaultPath + `/log.txt`;

        let weapons = [{ wpn_Name: "", wpn_AtkBonus: "", wpn_Damage: "" },
        { wpn_Name: "", wpn_AtkBonus: "", wpn_Damage: "" },
        { wpn_Name: "", wpn_AtkBonus: "", wpn_Damage: "" }];
        let wpnCount = 0;
        {
            items.map((item, index) => {
                if (
                    (item.item_equiped
                        || (item.item_amount && item.item_attunment)
                    )
                    && (
                        (item.item_type !== null && item.item_type.includes("Weapon"))
                        ||
                        (item.gear_type !== null && item.gear_type.includes("Weapon"))
                    )
                ) {
                    if (wpnCount < 3) {
                        if (item.item_id === null) {
                            weapons[wpnCount].wpn_Name = item.gear_name;
                            weapons[wpnCount].wpn_AtkBonus = item.item_hit;
                            weapons[wpnCount].wpn_Damage = item.item_damage;
                        } else {
                            weapons[wpnCount].wpn_Name = item.item_name;
                            weapons[wpnCount].wpn_AtkBonus = item.item_hit;
                            weapons[wpnCount].wpn_Damage = item.item_damage;
                        }
                    }
                    wpnCount++;
                }
            })
        }

        let data = {
            "CharacterName": `${name}`,
            "ClassLevel": `${classes}`,
            "Background": `${background}`,
            "PlayerName": `${player}`,
            "Race": `${race}`,
            "XP": `${level}`,
            "STR": `${str}`,
            "STRmod": `${formatScore(str)}`,
            "DEX": `${dex}`,
            "DEXmod": `${formatScore(dex)}`,
            "CON": `${con}`,
            "CONmod": `${formatScore(con)}`,
            "INT": `${int}`,
            "INTmod": `${formatScore(int)}`,
            "WIS": `${wis}`,
            "WISmod": `${formatScore(wis)}`,
            "CHA": `${cha}`,
            "CHAmod": `${formatScore(cha)}`,
            "ProfBonus": `+${prof}`,
            "Check Box 11": `${strSaveProf === 1 ? "Yes" : ""}`,
            "ST Strength": `${strSave}`,
            "Check Box 18": `${dexSaveProf === 1 ? "Yes" : ""}`,
            "ST Dexterity": `${dexSave}`,
            "Check Box 19": `${conSaveProf === 1 ? "Yes" : ""}`,
            "ST Constitution": `${conSave}`,
            "Check Box 20": `${intSaveProf === 1 ? "Yes" : ""}`,
            "ST Intelligence": `${intSave}`,
            "Check Box 21": `${wisSaveProf === 1 ? "Yes" : ""}`,
            "ST Wisdom": `${wisSave}`,
            "Check Box 22": `${chaSaveProf === 1 ? "Yes" : ""}`,
            "ST Charisma": `${chaSave}`,
            "Check Box 23": `${acrobaticsProf > 0 ? "Yes" : ""}`,
            "Acrobatics": `${acrobatics}`,
            "Check Box 24": `${animalHandlingProf > 0 ? "Yes" : ""}`,
            "Animal": `${animalHandling}`,
            "Check Box 25": `${arcanaProf > 0 ? "Yes" : ""}`,
            "Arcana": `${arcana}`,
            "Check Box 26": `${athleticsProf > 0 ? "Yes" : ""}`,
            "Athletics": `${athletics}`,
            "Check Box 27": `${deceptionProf > 0 ? "Yes" : ""}`,
            "Deception": `${deception}`,
            "Check Box 28": `${historyProf > 0 ? "Yes" : ""}`,
            "History": `${history}`,
            "Check Box 29": `${insightProf > 0 ? "Yes" : ""}`,
            "Insight": `${insight}`,
            "Check Box 30": `${intimidationProf > 0 ? "Yes" : ""}`,
            "Intimidation": `${intimidation}`,
            "Check Box 31": `${investigationProf > 0 ? "Yes" : ""}`,
            "Investigation": `${investigation}`,
            "Check Box 32": `${medicineProf > 0 ? "Yes" : ""}`,
            "Medicine": `${medicine}`,
            "Check Box 33": `${natureProf > 0 ? "Yes" : ""}`,
            "Nature": `${nature}`,
            "Check Box 34": `${perceptionProf > 0 ? "Yes" : ""}`,
            "Perception": `${perception}`,
            "Check Box 35": `${performanceProf > 0 ? "Yes" : ""}`,
            "Performance": `${performance}`,
            "Check Box 36": `${persuasionProf > 0 ? "Yes" : ""}`,
            "Persuasion": `${persuasion}`,
            "Check Box 37": `${religionProf > 0 ? "Yes" : ""}`,
            "Religion": `${religion}`,
            "Check Box 38": `${sleightOfHandProf > 0 ? "Yes" : ""}`,
            "SleightofHand": `${sleightOfHand}`,
            "Check Box 39": `${stealthProf > 0 ? "Yes" : ""}`,
            "Stealth": `${stealth}`,
            "Check Box 40": `${survivalProf > 0 ? "Yes" : ""}`,
            "Survival": `${survival}`,
            "Passive": `${passivPerception}`,
            "ProficienciesLang": `${profsLangs}`,
            "AC": `${ac}`,
            "Initiative": `${init}`,
            "HPMax": `${hp}`,
            "HPCurrent": `${currentHp}`,
            "HDTotal": `${hitDice}`,
            "Features and Traits": `${features + " " + racialFeatures + " " + classFeatures}`,
            "AttacksSpellcasting": `${actions + " " + bonusActions + " " + reactions}`,
            "Speed": `${speed}`,
            "Equipment": `${items.map(item => {
                if (item.item_id === null) {
                    return item.gear_name;
                } else {
                    return item.item_name + ", ";
                }
            })}`,
            "Wpn Name 1": `${weapons[0].wpn_Name}`,
            "Wpn1 AtkBonus": `${weapons[0].wpn_AtkBonus}`,
            "Wpn1 Damage": `${weapons[0].wpn_Damage}`,
            "Wpn Name 2": `${weapons[1].wpn_Name}`,
            "Wpn2 AtkBonus": `${weapons[1].wpn_AtkBonus}`,
            "Wpn2 Damage": `${weapons[1].wpn_Damage}`,
            "Wpn Name 3": `${weapons[2].wpn_Name}`,
            "Wpn3 AtkBonus": `${weapons[2].wpn_AtkBonus}`,
            "Wpn3 Damage": `${weapons[2].wpn_Damage}`,
            "Backstory": `${notesOne}`,
            "Feat+Traits": `${notesTwo}`,
            "Treasure": `${notesThree}`,
        };

        console.log(data);

        dialog.showSaveDialog(null, options, (path) => {
            PdfFillerService.fillPdf(sourcePDF, path, data, log);
        });
    }

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
    const viewGear = (gear) => {
        ipcRenderer.send('openGearView', gear);
    }
    const viewMonster = (monster) => {
        ipcRenderer.send('openMonsterView', monster);
    }

    const deleteCharSpellAction = (spell) => {
        deleteCharSpell(spell);
        reciveCharSpells(props.match.params.id, function (result) {
            receiveSpellsResult(result);
        })
    }
    const deleteCharItemAction = (item) => {
        deleteCharItem(item);
        reciveCharItems(props.match.params.id, function (result) {
            receiveItemsResult(result);
        })
    }
    const deleteCharMonsterAction = (monster) => {
        deleteCharMonster(monster);
        reciveCharMonsters(props.match.params.id, function (result) {
            reciveMonstersResult(result);
        })
    }


    const saveCharAction = () => {
        saveChar({
            id, name, player, prof, level, pic, classes, race, background, ac, hp, currentHp, hitDice,
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
        saveCharItems(items);
        saveCharSpells(spells);
    }

    const deleteCharAction = () => {
        deleteChar(id);
        historyRoute.push("/char-overview");
    }

    const showTab = (tab) => {
        if (tab === 0) {
            setTabs({ skills: true, combat: false, actions: false, features: false, spells: false, equipment: false, monsters: false, notes: false });
        } else if (tab === 1) {
            setTabs({ skills: false, combat: true, actions: false, features: false, spells: false, equipment: false, monsters: false, notes: false });
        } else if (tab === 2) {
            setTabs({ skills: false, combat: false, actions: true, features: false, spells: false, equipment: false, monsters: false, notes: false });
        } else if (tab === 3) {
            setTabs({ skills: false, combat: false, actions: false, features: true, spells: false, equipment: false, monsters: false, notes: false });
        } else if (tab === 4) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: true, equipment: false, monsters: false, notes: false });
        } else if (tab === 5) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: false, equipment: true, monsters: false, notes: false });
        } else if (tab === 6) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: false, equipment: false, monsters: true, notes: false });
        } else if (tab === 7) {
            setTabs({ skills: false, combat: false, actions: false, features: false, spells: false, equipment: false, monsters: false, notes: true });
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

    const changeIcon = (value) => {
        if (value === undefined || value === 0) {
            return faMinus;
        } else if (value === 1) {
            return faAngleUp;
        } else {
            return faAngleDoubleUp;
        }
    }
    const changeDeathIcon = (value) => {
        if (value === undefined || value === 0) {
            return faMinus;
        } else {
            return faHeartBroken;
        }
    }
    const changeLifeIcon = (value) => {
        if (value === undefined || value === 0) {
            return faMinus;
        } else {
            return faHeartbeat;
        }
    }

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
                <div className="smallLabelGroup">
                    <StatChart data={data} />
                </div>
                <div className="smallLabelGroup">
                    <button onClick={saveCharAction}><FontAwesomeIcon icon={faSave} /> Save</button><br />
                    <button className="delete" onClick={deleteCharAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button><br />
                    <button onClick={printChar}><FontAwesomeIcon icon={faPrint} /> Print</button>
                </div>
                <div className="tabComponent">
                    <div className="tabSelector">
                        <div className={`tabName ${tabs.skills ? "active" : ""}`} onClick={e => showTab(0)}>Attributes/Skills</div>
                        <div className={`tabName ${tabs.combat ? "active" : ""}`} onClick={e => showTab(1)}>Combat</div>
                        <div className={`tabName ${tabs.actions ? "active" : ""}`} onClick={e => showTab(2)}>Actions</div>
                        <div className={`tabName ${tabs.features ? "active" : ""}`} onClick={e => showTab(3)}>Features</div>
                        <div className={`tabName ${tabs.spells ? "active" : ""}`} onClick={e => showTab(4)}>Spells</div>
                        <div className={`tabName ${tabs.equipment ? "active" : ""}`} onClick={e => showTab(5)}>Equipment</div>
                        <div className={`tabName ${tabs.monsters ? "active" : ""}`} onClick={e => showTab(6)}>Monsters</div>
                        <div className={`tabName ${tabs.notes ? "active" : ""}`} onClick={e => showTab(7)}>Notes</div>
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
                            <div className="deathSaves">
                                <b>Death Saves:</b>
                                <div className="deathSave">Sucesses:
                                    <FontAwesomeIcon className="profToggler" icon={changeLifeIcon(lifeOne)} onClick={e => setLifeOne((lifeOne + 1) % 2)} />
                                    <FontAwesomeIcon className="profToggler" style={{ marginLeft: "30px" }} icon={changeLifeIcon(lifeTwo)} onClick={e => setLifeTwo((lifeTwo + 1) % 2)} />
                                    <FontAwesomeIcon className="profToggler" style={{ marginLeft: "55px" }} icon={changeLifeIcon(lifeThree)} onClick={e => setLifeThree((lifeThree + 1) % 2)} />
                                </div>
                                <div className="deathSave">Failures:
                                    <FontAwesomeIcon className="profToggler" icon={changeDeathIcon(deathOne)} onClick={e => setDeathOne((deathOne + 1) % 2)} />
                                    <FontAwesomeIcon className="profToggler" style={{ marginLeft: "30px" }} icon={changeDeathIcon(deathTwo)} onClick={e => setDeathTwo((deathTwo + 1) % 2)} />
                                    <FontAwesomeIcon className="profToggler" style={{ marginLeft: "55px" }} icon={changeDeathIcon(deathThree)} onClick={e => setDeathThree((deathThree + 1) % 2)} />
                                </div>
                            </div>
                            <div className="charItems" style={{ width: "auto" }}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>Hit</th>
                                            <th>Damage</th>
                                            <th>Range</th>
                                            <th>Properties</th>
                                        </tr>
                                        {items.map((item, index) => {
                                            if (
                                                (item.item_equiped
                                                    &&
                                                    ((item.item_attuned && item.item_attunment)
                                                        ||
                                                        item.item_attunment === null
                                                    )
                                                )
                                                && (
                                                    (item.item_type !== null && item.item_type.includes("Weapon"))
                                                    ||
                                                    (item.gear_type !== null && item.gear_type.includes("Weapon"))
                                                )
                                            ) {
                                                if (item.item_id === null) {
                                                    return <tr className="charItem" key={item.id} style={{ cursor: 'pointer' }}>
                                                        <td onClick={() => viewGear(item)}>{item.gear_name}</td>
                                                        <td className="centered"><input type="text" style={{ width: "50px" }} value={item.item_hit} onChange={createValueListenerItem(item, "item_hit")} /></td>
                                                        <td className="centered"><input type="text" style={{ width: "200px" }} value={item.item_damage} onChange={createValueListenerItem(item, "item_damage")} /></td>
                                                        <td className="centered"><input type="text" style={{ width: "50px" }} value={item.item_range} onChange={createValueListenerItem(item, "item_range")} /></td>
                                                        <td className="centered"><input type="text" style={{ width: "300px" }} value={item.item_properties} onChange={createValueListenerItem(item, "item_properties")} /></td>
                                                    </tr>;
                                                } else {
                                                    return <tr className="charItem" key={item.id} style={{ cursor: 'pointer' }}>
                                                        <td onClick={() => viewItem(item)}>{item.item_name}</td>
                                                        <td className="centered"><input type="text" style={{ width: "50px" }} value={item.item_hit} onChange={createValueListenerItem(item, "item_hit")} /></td>
                                                        <td className="centered"><input type="text" style={{ width: "200px" }} value={item.item_damage} onChange={createValueListenerItem(item, "item_damage")} /></td>
                                                        <td className="centered"><input type="text" style={{ width: "50px" }} value={item.item_range} onChange={createValueListenerItem(item, "item_range")} /></td>
                                                        <td className="centered"><input type="text" style={{ width: "300px" }} value={item.item_properties} onChange={createValueListenerItem(item, "item_properties")} /></td>
                                                    </tr>;
                                                }
                                            }
                                        })}
                                    </tbody>
                                </table>
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
                                <label>Passive Investigation:<input name="passivInvestigation" type="number" value={passivInvestigation} onChange={e => setPassivInvestigation(e.target.value)} /></label><br />
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
                            <div className="charSpells">
                                <div style={{ width: "clacl(100% - 10px)", height: "30px", padding: "5px" }}>
                                    <div className="castingInfo">
                                        <label>Hit: <input type="number" value={castingHit} onChange={e => setCastingHit(e.target.value)}></input></label>
                                        <label>DC: <input type="number" value={castingDC} onChange={e => setCastingDC(e.target.value)}></input></label>
                                    </div>
                                    <button onClick={levelortSpells} style={{ width: "150px" }}><FontAwesomeIcon icon={faFileExport} /> Levelort as cards</button>
                                </div>
                                <table style={{ width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <th>Lvl</th>
                                            <th>Name</th>
                                            <th>Casting Time</th>
                                            <th>Range</th>
                                            <th className="centered">Prepared?</th>
                                            <th className="centered">Remove</th>
                                        </tr>
                                        {spells.map((spell, index) => {
                                            return <tr className="charSpell" key={spell.id} style={{ cursor: 'pointer' }}>
                                                <td onClick={() => viewSpell(spell)}>{formatLevel(spell.spell_level)}</td>
                                                <td onClick={() => viewSpell(spell)}>{spell.spell_name}</td>
                                                <td onClick={() => viewSpell(spell)}>{formatCastingTime(spell.spell_time)}</td>
                                                <td onClick={() => viewSpell(spell)}>{spell.spell_range}</td>
                                                <td className="centered">
                                                    <label className="checkbox-label">
                                                        <input name="prepared" type="checkbox" checked={spell.spell_prepared} onChange={createCheckedListenerSpell(spell, "spell_prepared")} />
                                                        <span className="checkbox-custom circular"></span>
                                                    </label>
                                                </td>
                                                <td onClick={() => deleteCharSpellAction(spell)} className="centered removeIcon"><FontAwesomeIcon icon={faTimes} /></td>
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
                                            <th>Cost</th>
                                            <th>Weight</th>
                                            <th className="centered">Amount</th>
                                            <th className="centered">Equiped?</th>
                                            <th className="centered">Attuned?</th>
                                            <th className="centered">Remove</th>
                                        </tr>
                                        {items.map((item, index) => {
                                            if (item.item_id === null) {
                                                return <tr className="charItem" key={item.id} style={{ cursor: 'pointer' }}>
                                                    <td onClick={() => viewGear(item)}>{item.gear_name}</td>
                                                    <td onClick={() => viewGear(item)}>{item.gear_type}</td>
                                                    <td className="centered" onClick={() => viewItem(item)}>{item.gear_cost}</td>
                                                    <td className="centered" onClick={() => viewItem(item)}>{item.gear_weight}</td>
                                                    <td className="centered">
                                                        <input type="number" value={item.item_amount} onChange={createValueListenerItem(item, "item_amount")} />
                                                    </td>
                                                    <td className="centered">
                                                        <label className="checkbox-label">
                                                            <input name="equiped" type="checkbox" checked={item.item_equiped} onChange={createCheckedListenerItem(item, "item_equiped")} />
                                                            <span className="checkbox-custom circular"></span>
                                                        </label>
                                                    </td>
                                                    <td className="centered">
                                                        {item.item_attunment === 1 ?
                                                            <label className="checkbox-label">
                                                                <input name="attuned" type="checkbox" checked={item.item_attuned} onChange={createCheckedListenerItem(item, "item_attuned")} />
                                                                <span className="checkbox-custom circular"></span>
                                                            </label> : ""}

                                                    </td>
                                                    <td onClick={() => deleteCharItemAction(item)} className="centered removeIcon"><FontAwesomeIcon icon={faTimes} /></td>
                                                </tr>;
                                            } else {
                                                return <tr className="charItem" key={item.id} style={{ cursor: 'pointer' }}>
                                                    <td onClick={() => viewItem(item)}>{item.item_name}</td>
                                                    <td onClick={() => viewItem(item)}>{item.item_type}</td>
                                                    <td className="centered" onClick={() => viewItem(item)}></td>
                                                    <td className="centered" onClick={() => viewItem(item)}></td>
                                                    <td className="centered">
                                                        <input type="number" value={item.item_amount} onChange={createValueListenerItem(item, "item_amount")} />
                                                    </td>
                                                    <td className="centered">
                                                        <label className="checkbox-label">
                                                            <input name="equiped" type="checkbox" checked={item.item_equiped} onChange={createCheckedListenerItem(item, "item_equiped")} />
                                                            <span className="checkbox-custom circular"></span>
                                                        </label>
                                                    </td>
                                                    <td className="centered">
                                                        {item.item_attunment === 1 ?
                                                            <label className="checkbox-label">
                                                                <input name="attuned" type="checkbox" checked={item.item_attuned} onChange={createCheckedListenerItem(item, "item_attuned")} />
                                                                <span className="checkbox-custom circular"></span>
                                                            </label> : ""}

                                                    </td>
                                                    <td onClick={() => deleteCharItemAction(item)} className="centered removeIcon"><FontAwesomeIcon icon={faTimes} /></td>
                                                </tr>;
                                            }
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="tabContent" style={{ display: tabs.monsters ? "flex" : "none" }}>
                            <div className="charMonsters">
                                <table style={{ width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <th>CR</th>
                                            <th>Name</th>
                                            <th>AC</th>
                                            <th>Hit Points</th>
                                            <th>Speed</th>
                                            <th className="centered">Remove</th>
                                        </tr>
                                        {monsters.map((monster, index) => {
                                            return <tr className="charMonster" key={index} style={{ cursor: 'pointer' }}>
                                                <td onClick={() => viewMonster(monster)}>{monster.monster_cr}</td>
                                                <td onClick={() => viewMonster(monster)}>{monster.monster_name}</td>
                                                <td onClick={() => viewMonster(monster)}>{monster.monster_armorClass}</td>
                                                <td onClick={() => viewMonster(monster)}>{monster.monster_hitPoints}</td>
                                                <td onClick={() => viewMonster(monster)}>{monster.monster_speed}</td>
                                                <td onClick={() => deleteCharMonsterAction(monster)} className="centered removeIcon"><FontAwesomeIcon icon={faTimes} /></td>
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
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
