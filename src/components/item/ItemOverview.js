import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/item/ItemOverview.css';
import Item from './Item';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function ItemOverview(props) {
    const [currentItemList, setCurrentItemList] = useState({ items: [] });
    const items = useRef(null);

    const receiveItems = (evt, result) => {
        setCurrentItemList({ items: result });
        items.current.scrollTop = 0;
    }

    const updateItem = (evt, result) => {
        let { itemStep, itemStart } = result;
        ipcRenderer.send('getSearchItems', { step: itemStep, start: itemStart });
    }

    useEffect(() => {
        ipcRenderer.send('getSearchItems', { step: 10, start: 0 });
        ipcRenderer.on("getSearchItemsResult", receiveItems);
        ipcRenderer.on("itemsUpdated", updateItem);
        return () => {
            ipcRenderer.removeListener("getSearchItemsResult", receiveItems);
            ipcRenderer.removeListener("itemsUpdated", updateItem);
        }
    }, []);

    const viewItem = (item) => {
        ipcRenderer.send('openItemView', item);
    }

    return (
        <div id="overview">
            <div id="itemsOverview">
                <SearchBar inputs={["name", "description", "rarity", "type", "source"]} queryName="sendItemSearchQuery" />
                <div id={`items_${props.theme}`} ref={items}>
                    {currentItemList.items.map((item, index) => {
                        return <Item delay={index} theme={props.theme} item={item} key={item.item_id} onClick={() => viewItem(item)} />;
                    })}
                </div>
            </div>
            <Pagination name="Item" />
        </div>
    )

}
