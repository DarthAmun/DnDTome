import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/gear/GearOverview.css';
import Gear from './Gear';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function GearOverview() {
    const [currentGearList, setCurrentGearList] = useState({ gears: [] });
    const gears = useRef(null);

    const receiveGears = (evt, result) => {
        setCurrentGearList({ gears: result });
        gears.current.scrollTop = 0;
    }

    const updateGear = (evt, result) => {
        let { gearStep, gearStart } = result;
        ipcRenderer.send('getSearchGears', { step: gearStep, start: gearStart });
    }

    useEffect(() => {
        ipcRenderer.send('getSearchGears', { step: 10, start: 0 });
        ipcRenderer.on("getSearchGearsResult", receiveGears);
        ipcRenderer.on("gearsUpdated", updateGear);
        return () => {
            ipcRenderer.removeListener("getSearchGearsResult", receiveGears);
            ipcRenderer.removeListener("itemsUpdated", updateGear);
        }
    }, []);

    const viewGear = (gear) => {
        ipcRenderer.send('openGearView', gear);
    }

    return (
        <div id="overview">
            <div id="itemsOverview">
                <SearchBar inputs={["name", "type", "description", "cost", "damage", "properties", "weight"]} queryName="sendGearSearchQuery" />
                <div id="items" ref={gears}>
                    {currentGearList.gears.map((gear, index) => {
                        return <Gear delay={index} gear={gear} key={gear.gear_id} onClick={() => viewGear(gear)} />;
                    })}
                </div>
            </div>
            <Pagination name="Gear" />
        </div>
    )

}
