import React, { Component } from 'react';
import '../assets/css/ItemOverview.css';
import Item from './Item';
import ItemView from './ItemView';
import LeftNav from './LeftNav';
import TopNav from './TopNav';

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
        ipcRenderer.send('getItems', { step: 10000, start: 0 });
        ipcRenderer.on("getItemsResult", this.receiveItems);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getItemsResult", this.receiveItems)
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
                <div id="itemsContent">
                    <div id="items" style={{ width: `${this.state.width}` }}>
                        {this.state.currentItemList.items.map((item, index) => {
                            return <Item delay={index} item={item} key={item.item_id} onClick={() => this.viewItem(item)} />;
                        })}
                    </div>
                    <ItemView item={this.state.currentSelectedItem} />
                </div>
            </div>
        )
    }
}

export default ItemOverview;