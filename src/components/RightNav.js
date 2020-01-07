import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import "../assets/css/RightNav.css";
import icon from "../assets/img/dice_icon_grey.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import SpellView from "./spell/SpellView";
import ItemView from "./item/ItemView";
import GearView from "./gear/GearView";
import MonsterView from "./monster/MonsterView";
import CharView from "./char/CharView";
import RaceView from "./race/RaceView";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function RightNav() {
  const [shortWindows, setShortWindows] = useState([]);
  const [activeView, setActiveView] = useState({});
  const [showView, setShowView] = useState(false);

  const receiveResult = (event, result) => {
    console.log(result);
    let type = "";
    if (result.spell_id !== undefined) {
      type = "spell";
    } else if (result.item_id !== undefined) {
      type = "item";
    } else if (result.gear_id !== undefined) {
      type = "gear";
    } else if (result.race_id !== undefined) {
      type = "race";
    } else if (result.monster_id !== undefined) {
      type = "monster";
    } else if (result.char_id !== undefined) {
      type = "char";
    }

    let newWindow = { ...result, windowType: type };
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => [...shortWindows, newWindow]);
      setActiveView(newWindow);
      setShowView(true);
    });
  };

  useEffect(() => {
    ipcRenderer.on("onView", receiveResult);

    return () => {
      ipcRenderer.removeListener("onView", receiveResult);
    };
  }, []);

  const getSpellPicture = spell => {
    if (spell.spell_pic === "" || spell.spell_pic === null) {
      return icon;
    }
    return spell.spell_pic;
  };
  const getMonsterPicture = monster => {
    if (monster.monster_pic === "" || monster.monster_pic === null) {
      return icon;
    }
    return monster.monster_pic;
  };
  const getItemPicture = item => {
    if (item.item_pic === "" || item.item_pic === null) {
      return icon;
    }
    return item.item_pic;
  };
  const getGearPicture = gear => {
    if (gear.gear_pic === "" || gear.gear_pic === null) {
      return icon;
    }
    return gear.gear_pic;
  };
  const getCharPicture = char => {
    if (char.char_pic === "" || char.char_pic === null) {
      return icon;
    }
    return char.char_pic;
  };
  const getRacePicture = race => {
    if (race.race_pic === "" || race.race_pic === null) {
      return icon;
    }
    return race.race_pic;
  };

  const getView = () => {
    if (activeView.windowType === "spell") {
      return (
        <div className="activeView" style={{ display: `${showView ? "block" : "none"}` }}>
          <SpellView spell={activeView} />
        </div>
      );
    } else if (activeView.windowType === "item") {
      return (
        <div className="activeView" style={{ display: `${showView ? "block" : "none"}` }}>
          <ItemView item={activeView} />
        </div>
      );
    } else if (activeView.windowType === "gear") {
      return (
        <div className="activeView" style={{ display: `${showView ? "block" : "none"}` }}>
          <GearView gear={activeView} />
        </div>
      );
    } else if (activeView.windowType === "monster") {
      return (
        <div className="activeView" style={{ display: `${showView ? "block" : "none"}` }}>
          <MonsterView monster={activeView} />
        </div>
      );
    } else if (activeView.windowType === "char") {
      return (
        <div className="activeView" style={{ display: `${showView ? "block" : "none"}` }}>
          <CharView char={activeView} />
        </div>
      );
    } else if (activeView.windowType === "race") {
      return (
        <div className="activeView" style={{ display: `${showView ? "block" : "none"}` }}>
          <RaceView race={activeView} />
        </div>
      );
    }
    return "";
  };

  const showActiveView = window => {
    if (window === activeView && showView) {
      setShowView(false);
    } else {
      ReactDOM.unstable_batchedUpdates(() => {
        setActiveView(window);
        setShowView(true);
      });
    }
  };

  const removeView = (windows) => {
    let wins = shortWindows.filter(window => window !== windows);
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(wins);
      setShowView(false);
    });
  }

  return (
    <div id="rightNav">
      {getView()}
      {shortWindows.map((window, index) => {
        if (window.windowType === "spell") {
          return (
            <div className="windowContainer" key={index} >
              <div className="removeWindow" onClick={e => removeView(window)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="image" onClick={e => showActiveView(window)} style={{ backgroundImage: `url(${getSpellPicture(window)})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
            </div>
          );
        } else if (window.windowType === "item") {
          return (
            <div className="windowContainer" key={index} >
              <div className="removeWindow" onClick={e => removeView(window)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="image" onClick={e => showActiveView(window)} style={{ backgroundImage: `url(${getItemPicture(window)})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
            </div>
          );
        } else if (window.windowType === "gear") {
          return (
            <div className="windowContainer" key={index} >
              <div className="removeWindow" onClick={e => removeView(window)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="image" onClick={e => showActiveView(window)} style={{ backgroundImage: `url(${getGearPicture(window)})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", }}></div>
            </div>
          );
        } else if (window.windowType === "monster") {
          return (
            <div className="windowContainer" key={index} >
              <div className="removeWindow" onClick={e => removeView(window)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="image" onClick={e => showActiveView(window)} style={{ backgroundImage: `url(${getMonsterPicture(window)})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", }}></div>
            </div>
          );
        } else if (window.windowType === "race") {
          return (
            <div className="windowContainer" key={index} >
              <div className="removeWindow" onClick={e => removeView(window)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="image" onClick={e => showActiveView(window)} style={{ backgroundImage: `url(${getRacePicture(window)})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", }}></div>
            </div>
          );
        } else if (window.windowType === "char") {
          return (
            <div className="windowContainer" key={index} >
              <div className="removeWindow" onClick={e => removeView(window)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="image" onClick={e => showActiveView(window)} style={{ backgroundImage: `url(${getCharPicture(window)})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", }}></div>
            </div>
          );
        }
      })}
    </div>
  );
}
