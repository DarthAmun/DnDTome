import React, { Component } from 'react';
import '../../assets/css/Item.css';

class Item extends Component {

    getRarityClass = () => {
        let rarityClass = this.props.item.item_rarity;
        rarityClass = rarityClass.replace("A*", "").trim();
        rarityClass = rarityClass.replace(/\s/g, "");
        return rarityClass;
    }

    render() {
        return (
            <div className="item" style={{ animationDelay: `${this.props.delay * 50}ms` }} onClick={this.props.onClick}>
                <div className={`itemIcon ${this.getRarityClass()}`}><img src={this.props.item.item_pic}></img></div>
                <div className="itemComp">{this.props.item.item_name}</div>
                <div className="itemComp smallItemAttr">{this.props.item.item_type}</div>
                <div className="itemComp smallItemAttr">{this.props.item.item_rarity}</div>
            </div>
        )
    }
}

export default Item;