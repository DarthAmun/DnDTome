import React, { Component } from 'react';
import '../../assets/css/ItemOverview.css';
import Item from './Item';
import ItemView from './ItemView';
import ItemSearchBar from './ItemSearchBar';
import ItemPagination from './ItemPagination';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class ItemOverview extends Component {
    state = {
        currentItemList: { items: [] },
        currentSelectedItem: null,
        width: "100%"
    }

    receiveItems = (evt, result) => {
        this.setState({
            ...this.state,
            currentItemList: {
                items: result
            }
        })
    }

    componentDidMount() {
        ipcRenderer.send('getItems', { step: 10, start: 0 });
        ipcRenderer.on("getSearchItemsResult", this.receiveItems);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getSearchItemsResult", this.receiveItems)
    }

    viewItem = (item) => {
        this.setState({
            ...this.state,
            currentSelectedItem: item,
            width: "calc(100% - 470px)"
        })
    }

    render() {
        return (
            <div id="overview">
                <ItemSearchBar />
                <div id="itemsContent">
                    <div id="items" style={{ width: `${this.state.width}` }}>
                        {this.state.currentItemList.items.map((item, index) => {
                            return <Item delay={index} item={item} key={item.item_id} onClick={() => this.viewItem(item)} />;
                        })}
                    </div>
                    <ItemView item={this.state.currentSelectedItem} />
                </div>
                <ItemPagination />
            </div>
        )
    }
}

export default ItemOverview;