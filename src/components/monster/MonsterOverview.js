import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ReactDOM from "react-dom";
import "../../assets/css/monster/MonsterOverview.css";
import Monster from "./Monster";
import MonsterSearchBar from "./MonsterSearchBar";
import { reciveMonsters, reciveMonsterCount } from "../../database/MonsterService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function MonsterOverview() {
  const [currentMonsterList, setCurrentMonsterList] = useState({ monsters: [] });
  const monsters = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [start, setStart] = useState(0);
  const [query, setQuery] = useState({});

  const receiveMonstersResult = result => {
    let newList = currentMonsterList.monsters;
    newList = newList.concat(result);

    ReactDOM.unstable_batchedUpdates(() => {
      setCurrentMonsterList({ monsters: newList });
      setStart(start + 10);
    });
  };

  const updateMonster = (e, result) => {
    let monsters = currentMonsterList.monsters.map(monster => {
      if (monster.monster_id === result.monster_id) {
        return result;
      } else {
        return monster;
      }
    });
    setCurrentMonsterList({ monsters: monsters });
  };
  const removeWindow = (e, result) => {
    let monsters = currentMonsterList.monsters.filter(monster => {
      if (monster.monster_id !== result.id) return monster;
    });
    setCurrentMonsterList({ monsters: monsters });
  };

  const searchMonster = (evt, rquery) => {
    setQuery(rquery.query);
    monsters.current.scrollTop = 0;
    setStart(0);
    reciveMonsters(10, 0, rquery.query, function(result) {
      receiveMonstersResult(result);
    });
  };

  useEffect(() => {
    ipcRenderer.on("sendMonsterSearchQuery", searchMonster);
    return () => {
      ipcRenderer.removeListener("sendMonsterSearchQuery", searchMonster);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on("updateWindow", updateMonster);
    return () => {
      ipcRenderer.removeListener("updateWindow", updateMonster);
    };
  }, [updateMonster]);

  useEffect(() => {
    ipcRenderer.on("removeWindow", removeWindow);
    return () => {
      ipcRenderer.removeListener("removeWindow", removeWindow);
    };
  }, [removeWindow]);

  useEffect(() => {
    if (isFetching) {
      fetchMoreListItems();
    }
  }, [isFetching]);

  useEffect(() => {
    setIsFetching(false);

    reciveMonsterCount(query, function(result) {
      let monsterCount = result.count;
      if (monsterCount > currentMonsterList.monsters.length) {
        if (!currentMonsterList.monsters.length) {
          reciveMonsters(10, start, query, function(result) {
            receiveMonstersResult(result);
          });
        }
        if (monsters.current.scrollHeight == monsters.current.clientHeight && currentMonsterList.monsters.length) {
          reciveMonsters(10, start, query, function(monsters) {
            receiveMonstersResult(monsters);
          });
        }
      }
    });
  }, [currentMonsterList]);

  const viewMonster = monster => {
    ipcRenderer.send("openView", monster);
  };

  const fetchMoreListItems = () => {
    reciveMonsters(10, start, query, function(result) {
      receiveMonstersResult(result);
    });
  };

  const handleScroll = () => {
    if (Math.round(monsters.current.offsetHeight + monsters.current.scrollTop) < monsters.current.scrollHeight - 240)
      return;
    setIsFetching(true);
  };

  return (
    <div id="overview">
      <div id="monsterOverview">
        <MonsterSearchBar />
        <div id="monsters" onScroll={handleScroll} ref={monsters}>
          {currentMonsterList.monsters.map((monster, index) => {
            return (
              <Monster delay={0} monster={monster} key={monster.monster_id} onClick={() => viewMonster(monster)} />
            );
          })}
        </div>
      </div>
      <Link to={`/add-monster`} className="button">
        <FontAwesomeIcon icon={faPlus} /> Add new Monster
      </Link>
    </div>
  );
}
