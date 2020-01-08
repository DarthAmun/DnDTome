import React, { useState, useEffect } from 'react';
import '../assets/css/Encounters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faLevelDownAlt, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import icon from '../assets/img/dice_icon_grey.png';

import { reciveAllMonsters, reciveMonstersByName } from '../database/MonsterService';
import { reciveAllChars } from '../database/CharacterService';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function Encounters() {
    const [charList, setCharList] = useState([]);
    const [monsterList, setMonsterList] = useState([]);
    const [participantList, setParticipantList] = useState([]);

    const [subIdCount, setSubIdCount] = useState(1);
    const [current, setCurrent] = useState(0);

    const [monsterSearch, setMonsterSearch] = useState("");

    useEffect(() => {
        reciveAllChars(function (chars) {
            setCharList(chars);
        });
        reciveAllMonsters(function (monsters) {
            setMonsterList(monsters);
        });
    }, []);

    const sendQuery = e => {
        reciveMonstersByName(monsterSearch, function (monsters) {
            setMonsterList(monsters);
        })
    };

    const addChar = char => {
        let participant = { id: char.char_id, subid: subIdCount, name: char.char_name, hp: char.char_hp, currentHp: char.char_hp, ac: char.char_ac, initBonus: char.char_init, init: 0, tag: "", char: char, current: "" };
        setSubIdCount(subIdCount + 1);
        let list = participantList.concat(participant);
        setParticipantList(list);
    }
    const addMonster = monster => {
        let participant = { id: monster.monster_id, subid: subIdCount, name: monster.monster_name, hp: monster.monster_hitPoints, currentHp: monster.monster_hitPoints, ac: monster.monster_armorClass, initBonus: 0, init: 0, tag: "", monster: monster, current: "" };
        setSubIdCount(subIdCount + 1);
        let list = participantList.concat(participant);
        setParticipantList(list);
    }

    const deleteAction = (index, subid) => {
        if (index < current) {
            setCurrent(current - 1);
        }
        let part = participantList.filter(participant => participant.subid !== subid);
        setParticipantList(part);
    }

    const nextPraticipant = () => {
        setCurrent((current + 1) % participantList.length);
    }

    const rollInitiative = () => {
        setCurrent(0);
        const min = 1;
        const max = 20;
        let part = participantList.map(participant => {
            const rand = Math.round(min + Math.random() * (max - min)) + participant.initBonus;
            return { ...participant, init: rand };
        });
        setParticipantList(part);
    }

    const setParticipantTag = (e, subid) => {
        let part = participantList.map(participant => {
            if (participant.subid === subid) { return { ...participant, tag: e.target.value }; } else { return participant; }
        });
        setParticipantList(part);
    }
    const setParticipantAc = (e, subid) => {
        let part = participantList.map(participant => {
            if (participant.subid === subid) { return { ...participant, ac: e.target.value }; } else { return participant; }
        });
        setParticipantList(part);
    }
    const setParticipantHp = (e, subid) => {
        let part = participantList.map(participant => {
            if (participant.subid === subid) { return { ...participant, currentHp: e.target.value }; } else { return participant; }
        });
        setParticipantList(part);
    }
    const setParticipantInit = (e, subid) => {
        let part = participantList.map(participant => {
            if (participant.subid === subid) { return { ...participant, init: e.target.value }; } else { return participant; }
        });
        setParticipantList(part);
    }

    const viewParticipant = (participant) => {
        if (participant.monster !== undefined) {
            ipcRenderer.send('openView', participant.monster);
        }
        if (participant.char !== undefined) {
            ipcRenderer.send('openView', participant.char);
        }
    }

    const getPicture = (participant) => {
        if (participant.monster !== undefined) {
            if (participant.monster.monster_pic === "" || participant.monster.monster_pic === null) {
                return icon;
            }
            return participant.monster.monster_pic;
        } else if(participant.char !== undefined) {
            if (participant.char.char_pic === "") {
                return icon;
            }
            return participant.char.char_pic;
        }
        return icon;
    };

    return (
        <div id="overview">
            <div id="encounterOverview">
                <div id="encounterAddMenu">
                    <div className="triangle"></div>
                    <div id="encounterAddChar">
                        <div className="encounterAddTitle"><b>Characters</b></div>
                        <div className="encounterAddCharList">
                            {
                                charList.map(char => {
                                    return <div className="encouterAddItem" key={char.char_id} onClick={e => addChar(char)}>Lvl{char.char_level} | {char.char_name}</div>;
                                })
                            }
                        </div>
                    </div>
                    <div id="encounterAddMonster">
                        <div className="encounterAddTitle" onKeyUp={sendQuery}>
                            <input type="text" name="Monster" value={monsterSearch} placeholder="Monster..." onChange={e => setMonsterSearch(e.target.value)} />
                        </div>
                        <div className="encounterAddMonsterList">
                            {
                                monsterList.map(monster => {
                                    return <div className="encouterAddItem" key={monster.monster_id} onClick={e => addMonster(monster)}>{monster.monster_name}</div>;
                                })
                            }
                        </div>
                    </div>
                </div>
                <div id="encounterContent">
                    <div className="encouterParticipantHeader">
                        <div className="encounterParticipantInit">Initiative</div>
                        <div className="encounterParticipantName">Name</div>
                        <div className="encounterParticipantCurrentHp">Current</div>
                        <div className="encounterParticipantHp">Hp</div>
                        <div className="encounterParticipantAc">AC</div>
                        <div className="encounterParticipantActions">Actions</div>
                    </div>
                    {
                        participantList.sort((a, b) => { return b.init - a.init }).map((participant, index) => {
                            return <div className={`encouterParticipant ${current === index ? "current" : ""}`} key={index}>
                                <div className="encounterParticipantInit">
                                    <input type="text" name={participant.init} placeholder="0" value={participant.init} onChange={e => setParticipantInit(e, participant.subid)} />
                                </div>
                                <div className="encounterParticipantName" onClick={() => viewParticipant(participant)}>
                                <div className="image" style={{backgroundImage: `url(${getPicture(participant)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
                                    {participant.name}
                                </div>
                                <div className="encounterParticipantCurrentHp">
                                    <input type="text" name={participant.currentHp} placeholder="0" value={participant.currentHp} onChange={e => setParticipantHp(e, participant.subid)} />
                                </div>
                                <div className="encounterParticipantHp">
                                    {participant.hp}
                                </div>
                                <div className="encounterParticipantAc">
                                    <input type="text" name={participant.ac} placeholder="0" value={participant.ac} onChange={e => setParticipantAc(e, participant.subid)} />
                                </div>
                                <div className="encounterParticipantActions">
                                    <div className="encounterParticipantActionsTag">
                                        <input type="text" name={participant} placeholder="Tag..." value={participant.tag} onChange={e => setParticipantTag(e, participant.subid)} />
                                    </div>
                                    <button onClick={e => deleteAction(index, participant.subid)} className="delete"><FontAwesomeIcon icon={faSkullCrossbones} /></button>
                                </div>
                            </div>;
                        })
                    }
                </div>
            </div>
            <button onClick={rollInitiative} className="button">
                <FontAwesomeIcon icon={faDice} /> Roll Initiative
            </button>
            <button onClick={nextPraticipant} className="button">
                <FontAwesomeIcon icon={faLevelDownAlt} /> Next
            </button>
        </div>
    );
}