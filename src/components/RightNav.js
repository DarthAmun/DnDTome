import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../assets/css/RightNav.css';
import icon from '../assets/img/dice_icon_grey.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMeteor, faIdCard, faShieldAlt, faDiceD20, faCog, faDragon, faFistRaised } from '@fortawesome/free-solid-svg-icons';
import SpellView from './spell/SpellView';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function RightNav() {
  const [shortWindows, setShortWindows] = useState([]);
  const [activeView, setActiveView] = useState({});

  const receiveSpellResult = (event, result) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => ([...shortWindows, { ...result, windowType: 'spell' }]));
      setActiveView({ ...result, windowType: 'spell' });
    })
  }
  const receiveRaceResult = (event, result) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => ([...shortWindows, { ...result, windowType: 'race' }]));
    })
  }
  const receiveMonsterResult = (event, result) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => ([...shortWindows, { ...result, windowType: 'monster' }]));
    })
  }
  const receiveItemResult = (event, result) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => ([...shortWindows, { ...result, windowType: 'item' }]));
    })
  }
  const receiveGearResult = (event, result) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => ([...shortWindows, { ...result, windowType: 'gear' }]));
    })
  }
  const receiveCharResult = (event, result) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setShortWindows(shortWindows => ([...shortWindows, { ...result, windowType: 'char' }]));
    })
  }

  useEffect(() => {
    ipcRenderer.on("onViewSpell", receiveSpellResult);
    ipcRenderer.on("onViewRace", receiveRaceResult);
    ipcRenderer.on("onViewMonster", receiveMonsterResult);
    ipcRenderer.on("onViewItem", receiveItemResult);
    ipcRenderer.on("onViewGear", receiveGearResult);
    ipcRenderer.on("onViewChar", receiveCharResult);

    return () => {
      ipcRenderer.removeListener("onViewSpell", receiveSpellResult);
      ipcRenderer.removeListener("onViewRace", receiveRaceResult);
      ipcRenderer.removeListener("onViewMonster", receiveMonsterResult);
      ipcRenderer.removeListener("onViewItem", receiveItemResult);
      ipcRenderer.removeListener("onViewGear", receiveGearResult);
      ipcRenderer.removeListener("onViewChar", receiveCharResult);
    }
  }, []);

  useEffect(() => {
    console.log(activeView)
  }, [activeView]);

  const getSpellPicture = (spell) => {
    if (spell.spell_pic === "" || spell.spell_pic === null) {
      return icon;
    }
    return spell.spell_pic;
  };
  const getMonsterPicture = (monster) => {
    if (monster.monster_pic === "" || monster.monster_pic === null) {
      return icon;
    }
    return monster.monster_pic;
  };
  const getItemPicture = (item) => {
    if (item.item_pic === "" || item.item_pic === null) {
      return icon;
    }
    return item.item_pic;
  };
  const getGearPicture = (gear) => {
    if (gear.gear_pic === "" || gear.gear_pic === null) {
      return icon;
    }
    return gear.gear_pic;
  }
  const getCharPicture = (char) => {
    if (char.char_pic === "" || char.char_pic === null) {
      return icon;
    }
    return char.char_pic;
  }
  const getRacePicture = (race) => {
    if (race.race_pic === "" || race.race_pic === null) {
      return icon;
    }
    return race.race_pic;
  }

  const getView = () => {
    if (activeView.windowType === 'spell') {
      return <div className="activeView" style={{ width: "950px", height: "425px" }}>
        <SpellView spell={activeView} />
      </div>;
    }
    return '';
  }

  return (
    <div id="rightNav">
      {getView()}
      {shortWindows.map((window, index) => {
        if (window.windowType === 'spell') {
          return <div key={index} className="image" style={{ backgroundImage: `url(${getSpellPicture(window)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>;
        } else if (window.windowType === 'item') {
          return <div key={index} className="image" style={{ backgroundImage: `url(${getItemPicture(window)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>;
        } else if (window.windowType === 'gear') {
          return <div key={index} className="image" style={{ backgroundImage: `url(${getGearPicture(window)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>;
        } else if (window.windowType === 'monster') {
          return <div key={index} className="image" style={{ backgroundImage: `url(${getMonsterPicture(window)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>;
        } else if (window.windowType === 'race') {
          return <div key={index} className="image" style={{ backgroundImage: `url(${getRacePicture(window)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>;
        } else if (window.windowType === 'char') {
          return <div key={index} className="image" style={{ backgroundImage: `url(${getCharPicture(window)})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>;
        }
      })}
    </div>
  )
}
