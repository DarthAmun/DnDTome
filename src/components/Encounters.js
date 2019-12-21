import React, { useState, useEffect } from 'react';
import '../assets/css/Encounters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

import { reciveAllMonsters, reciveMonstersByName } from '../database/MonsterService';
import { reciveAllChars } from '../database/CharacterService';

export default function Encounters() {
    const [charList, setCharList] = useState([]);
    const [monsterList, setMonsterList] = useState([]);
    const [participantList, setParticipantList] = useState([]);

    const [monsterSearch, setMonsterSearch] = useState("");

    useEffect(() => {
        reciveAllChars(function (chars) {
            setCharList(chars);
        });
        reciveAllMonsters(function (monsters) {
            setMonsterList(monsters);
        });
    }, []);

    useEffect(() => {
        console.log(participantList)
    }, [participantList]);


    const sendQuery = e => {
        if (e.key === 'Enter') {
            reciveMonstersByName(monsterSearch, function (monsters) {
                setMonsterList(monsters);
            })
        }
    };

    const addChar = char => {
        let participant = { id: char.char_id, name: char.char_name, hp: char.char_hp, ac: char.char_ac, initBonus: char.char_init, init: 0};
        let list = participantList.concat(participant);
        setParticipantList(list);
    }
    const addMonster = monster => {
        let participant = { id: monster.monster_id, name: monster.monster_name, hp: monster.monster_hitPoints, ac: monster.monster_armorClass, initBonus: 0, init: 0 };
        let list = participantList.concat(participant);
        setParticipantList(list);
    }

    return (
        <div id="overview">
            <div id="encounterAddMenu">
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
                    <div className="encounterAddTitle" onKeyDown={sendQuery}>
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
                <div className="encouterParticipantHeader">Initiative Name Hp AC</div>
                {
                    participantList.map((participant, index) => {
                        return <div className="encouterParticipant" key={index}>{participant.init} {participant.name} {participant.hp} {participant.ac}</div>;
                    })
                }
            </div>
        </div>
    );
}