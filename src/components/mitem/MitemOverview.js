import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/mitem/MitemOverview.css';
import Mitem from './Mitem';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function MitemOverview(props) {
    const [currentMitemList, setCurrentMitemList] = useState({ mitems: [] });
    const mitems = useRef(null);

    const receiveMitems = (evt, result) => {
        setCurrentMitemList({ mitems: result });
        mitems.current.scrollTop = 0;
    }

    const updateMitem = (evt, result) => {
        let { mitemStep, mitemStart } = result;
        ipcRenderer.send('getSearchMitems', { step: mitemStep, start: mitemStart });
    }

    useEffect(() => {
        ipcRenderer.send('getSearchMitems', { step: 10, start: 0 });
        ipcRenderer.on("getSearchMitemsResult", receiveMitems);
        ipcRenderer.on("mitemsUpdated", updateMitem);
        return () => {
            ipcRenderer.removeListener("getSearchMitemsResult", receiveMitems);
            ipcRenderer.removeListener("itemsUpdated", updateMitem);
        }
    }, []);

    const viewMitem = (mitem) => {
        ipcRenderer.send('openMitemView', mitem);
    }

    return (
        <div id="overview">
            <div id="itemsOverview">
                <SearchBar inputs={["name", "description", "cost", "damage", "properties", "weight"]} queryName="sendMitemSearchQuery" />
                <div id={`items_${props.theme}`} ref={mitems}>
                    {currentMitemList.mitems.map((mitem, index) => {
                        return <Mitem delay={index} theme={props.theme} mitem={mitem} key={mitem.mitem_id} onClick={() => viewMitem(mitem)} />;
                    })}
                </div>
            </div>
            <Pagination name="Mitem" />
        </div>
    )

}
