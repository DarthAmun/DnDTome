import React, { Component } from 'react';
import '../../assets/css/item/ItemOverview.css';
import Item from './Item';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class ItemOverview extends Component {
    state = {
        currentItemList: { items: [] },
        currentSelectedItem: null
    }

    receiveItems = (evt, result) => {
        this.setState({
            ...this.state,
            currentItemList: {
                items: result
            }
        })
    }

    updateItem = (evt, result) => {
        let { itemStep, itemStart } = result;
        ipcRenderer.send('getSearchItems', { step: itemStep, start: itemStart });
    }

    componentDidMount() {
        ipcRenderer.send('getSearchItems', { step: 10, start: 0 });
        ipcRenderer.on("getSearchItemsResult", this.receiveItems);
        ipcRenderer.on("itemsUpdated", this.updateItem);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getSearchItemsResult", this.receiveItems);
        ipcRenderer.removeListener("itemsUpdated", this.updateItem);
    }

    viewItem = (item) => {
        ipcRenderer.send('openItemView', item);
    }

    render() {
        return (
            <div id="overview">
                <div id="itemsOverview">
                    <SearchBar inputs={["name", "description", "rarity", "type", "source"]} queryName="sendItemSearchQuery" />
                    <div id="items">
                        {this.state.currentItemList.items.map((item, index) => {
                            return <Item delay={index} item={item} key={item.item_id} onClick={() => this.viewItem(item)} />;
                        })}
                    </div>
                </div>
                <Pagination name="Item" />
            </div>
        )
    }
}

export default ItemOverview;