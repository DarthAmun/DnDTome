import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ReactDOM from "react-dom";
import "../../assets/css/spell/SpellOverview.css";
import Spell from "./Spell";
import { reciveSpells, reciveSpellCount } from "../../database/SpellService";
import SpellSearchBar from "./SpellSearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function SpellOverview() {
  const [currentSpellList, setCurrentSpellList] = useState({ spells: [] });
  const spells = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [start, setStart] = useState(0);
  const [query, setQuery] = useState({});

  const receiveSpellsResult = result => {
    let newList = currentSpellList.spells;
    newList = newList.concat(result);

    ReactDOM.unstable_batchedUpdates(() => {
      setCurrentSpellList({ spells: newList });
      setStart(start + 10);
    });
  };

  const updateSpell = (e, result) => {
    let spells = currentSpellList.spells.map(spell => {
      if (spell.spell_id === result.spell_id) {
        return result;
      } else {
        return spell;
      }
    });
    setCurrentSpellList({ spells: spells });
  };
  const removeWindow = (e, result) => {
    let spells = currentSpellList.spells.filter(spell => {
      if (spell.spell_id !== result.id) return spell;
    });
    setCurrentSpellList({ spells: spells });
  };

  const searchSpell = (evt, rquery) => {
    setQuery(rquery.query);
    spells.current.scrollTop = 0;
    setStart(0);
    reciveSpells(10, 0, rquery.query, function (result) {
      receiveSpellsResult(result);
    });
  };

  useEffect(() => {
    ipcRenderer.on("sendSpellSearchQuery", searchSpell);
    return () => {
      ipcRenderer.removeListener("sendSpellSearchQuery", searchSpell);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on("updateWindow", updateSpell);
    return () => {
      ipcRenderer.removeListener("updateWindow", updateSpell);
    };
  }, [updateSpell]);

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

    reciveSpellCount(query, function (result) {
      let spellCount = result.count;
      if (spellCount > currentSpellList.spells.length) {
        if (!currentSpellList.spells.length) {
          reciveSpells(10, start, query, function (result) {
            receiveSpellsResult(result);
          });
        }
        if (spells.current.scrollHeight == spells.current.clientHeight && currentSpellList.spells.length) {
          reciveSpells(10, start, query, function (spells) {
            receiveSpellsResult(spells);
          });
        }
      }
    });
  }, [currentSpellList]);

  const viewSpell = spell => {
    ipcRenderer.send("openView", spell);
  };

  const fetchMoreListItems = () => {
    reciveSpells(10, start, query, function (result) {
      receiveSpellsResult(result);
    });
  };

  const handleScroll = () => {
    if (Math.round(spells.current.offsetHeight + spells.current.scrollTop) < spells.current.scrollHeight - 240) return;
    setIsFetching(true);
  };

  return (
    <div id="overview">
      <div id="spellOverview">
        <SpellSearchBar />
        <div id="spells" onScroll={handleScroll} ref={spells}>
          {currentSpellList.spells.map((spell, index) => {
            return <Spell delay={0} spell={spell} key={spell.spell_id} onClick={() => viewSpell(spell)} />;
          })}
        </div>
      </div>
      <Link to={`/add-spell`} className="button">
        <FontAwesomeIcon icon={faPlus} /> Add new Spell
      </Link>
    </div>
  );
}
