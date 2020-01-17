import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ReactDOM from "react-dom";
import "../../assets/css/race/RaceOverview.css";
import Race from "./Race";
import RaceSearchBar from "./RaceSearchBar";
import { reciveRaces, reciveRaceCount } from "../../database/RaceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function RaceOverview() {
  const [currentRaceList, setCurrentRaceList] = useState({ races: [] });
  const races = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [start, setStart] = useState(0);
  const [query, setQuery] = useState({});

  const receiveRacesResult = result => {
    let newList = currentRaceList.races;
    newList = newList.concat(result);

    ReactDOM.unstable_batchedUpdates(() => {
      setCurrentRaceList({ races: newList });
      setStart(start + 10);
    });
  };

  const updateRace = (e, result) => {
    let races = currentRaceList.races.map(race => {
      if (race.race_id === result.race_id) {
        return result;
      } else {
        return race;
      }
    });
    setCurrentRaceList({ races: races });
  };
  const removeWindow = (e, result) => {
    let races = currentRaceList.races.filter(race => {
      if (race.race_id !== result.id) return race;
    });
    setCurrentRaceList({ races: races });
  };

  const searchRace = (evt, rquery) => {
    setQuery(rquery.query);
    races.current.scrollTop = 0;
    setStart(0);
    reciveRaces(10, 0, rquery.query, function(result) {
      receiveRacesResult(result);
    });
  };

  useEffect(() => {
    ipcRenderer.on("sendRaceSearchQuery", searchRace);
    return () => {
      ipcRenderer.removeListener("sendRaceSearchQuery", searchRace);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on("updateWindow", updateRace);
    return () => {
      ipcRenderer.removeListener("updateWindow", updateRace);
    };
  }, [updateRace]);

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

    reciveRaceCount(query, function(result) {
      let raceCount = result.count;
      if (raceCount > currentRaceList.races.length) {
        if (!currentRaceList.races.length) {
          reciveRaces(10, start, query, function(result) {
            receiveRacesResult(result);
          });
        }
        if (races.current.scrollHeight == races.current.clientHeight && currentRaceList.races.length) {
          reciveRaces(10, start, query, function(races) {
            receiveRacesResult(races);
          });
        }
      }
    });
  }, [currentRaceList]);

  const viewRace = race => {
    ipcRenderer.send("openView", race);
  };

  const fetchMoreListItems = () => {
    reciveRaces(10, start, query, function(result) {
      receiveRacesResult(result);
    });
  };

  const handleScroll = () => {
    if (Math.round(races.current.offsetHeight + races.current.scrollTop) < races.current.scrollHeight - 240) return;
    setIsFetching(true);
  };

  return (
    <div id="overview">
      <div id="raceOverview">
        <RaceSearchBar />
        <div id="races" onScroll={handleScroll} ref={races}>
          {currentRaceList.races.map((race, index) => {
            return <Race delay={0} race={race} key={race.race_id} onClick={() => viewRace(race)} />;
          })}
        </div>
      </div>
      <Link to={`/add-race`} className="button">
        <FontAwesomeIcon icon={faPlus} /> Add new Race
      </Link>
    </div>
  );
}
