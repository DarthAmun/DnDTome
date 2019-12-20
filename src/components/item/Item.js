import React from 'react';
import '../../assets/css/item/Item.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Item(props) {

    const getRarityClass = () => {
        let rarityClass = props.item.item_rarity;
        if(rarityClass !== null) {
            rarityClass = rarityClass.replace("A*", "").trim();
            rarityClass = rarityClass.replace(/\s/g, "");
            return rarityClass.toLowerCase();
        }
        return 'common';
    }

    const getPicture = () => {
        if (props.item.item_pic === "" || props.item.item_pic === null) {
            return icon;
        }
        return props.item.item_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'white'
    };

    return (
        <div className="item" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className={`itemIcon ${getRarityClass()}`} style={style}></div>
            <div className="itemComp">{props.item.item_name}</div>
            <div className="itemComp smallItemAttr">{props.item.item_type}</div>
            <div className="itemComp smallItemAttr">{props.item.item_rarity}</div>
        </div>
    )
}
