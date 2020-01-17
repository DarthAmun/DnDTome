import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ReactDOM from "react-dom";
import "../../assets/css/gear/GearOverview.css";
import Gear from "./Gear";
import GearSearchBar from "./GearSearchBar";
import { reciveGears, reciveGearCount } from "../../database/GearService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function GearOverview() {
  const [currentGearList, setCurrentGearList] = useState({ gears: [] });
  const gears = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [start, setStart] = useState(0);
  const [query, setQuery] = useState({});

  const receiveGearsResult = result => {
    let newList = currentGearList.gears;
    newList = newList.concat(result);

    ReactDOM.unstable_batchedUpdates(() => {
      setCurrentGearList({ gears: newList });
      setStart(start + 10);
    });
  };

  const updateGear = (e, result) => {
    let gears = currentGearList.gears.map(gear => {
      if (gear.gear_id === result.gear_id) {
        return result;
      } else {
        return gear;
      }
    });
    setCurrentGearList({ gears: gears });
  };
  const removeWindow = (e, result) => {
    let gears = currentGearList.gears.filter(gear => {
      if (gear.gear_id !== result.id) return gear;
    });
    setCurrentGearList({ gears: gears });
  };

  const searchGear = (evt, rquery) => {
    setQuery(rquery.query);
    gears.current.scrollTop = 0;
    setStart(0);
    reciveGears(10, 0, rquery.query, function(result) {
      receiveGearsResult(result);
    });
  };

  useEffect(() => {
    ipcRenderer.on("sendGearSearchQuery", searchGear);
    return () => {
      ipcRenderer.removeListener("sendGearSearchQuery", searchGear);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on("updateWindow", updateGear);
    return () => {
      ipcRenderer.removeListener("updateWindow", updateGear);
    };
  }, [updateGear]);

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
    reciveGearCount(query, function(result) {
      let gearCount = result.count;
      if (gearCount > currentGearList.gears.length) {
        if (!currentGearList.gears.length) {
          reciveGears(10, start, query, function(result) {
            receiveGearsResult(result);
          });
        }
        if (gears.current.scrollHeight == gears.current.clientHeight && currentGearList.gears.length) {
          reciveGears(10, start, query, function(result) {
            receiveGearsResult(result);
          });
        }
      }
    });
  }, [currentGearList]);

  const viewGear = gear => {
    ipcRenderer.send("openView", gear);
  };

  const fetchMoreListItems = () => {
    reciveGears(10, start, query, function(result) {
      receiveGearsResult(result);
    });
  };

  const handleScroll = () => {
    if (Math.round(gears.current.offsetHeight + gears.current.scrollTop) < gears.current.scrollHeight - 240) return;
    setIsFetching(true);
  };

  return (
    <div id="overview">
      <div id="itemsOverview">
        <GearSearchBar />
        <div id="items" onScroll={handleScroll} ref={gears}>
          {currentGearList.gears.map((gear, index) => {
            return <Gear delay={0} gear={gear} key={gear.gear_id} onClick={() => viewGear(gear)} />;
          })}
        </div>
      </div>
      <Link to={`/add-gear`} className="button">
        <FontAwesomeIcon icon={faPlus} /> Add new Gear
      </Link>
    </div>
  );
}
