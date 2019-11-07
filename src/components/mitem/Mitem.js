import React from 'react';
import '../../assets/css/mitem/Mitem.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Mitem(props) {

    const getPicture = () => {
        if (props.mitem.mitem_pic === "") {
            return icon;
        }
        return props.mitem.mitem_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className="mitem" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className="mitemIcon" style={style}></div>
            <div className="mitemComp">{props.mitem.mitem_name}</div>
            <div className="mitemComp smallMitemAttr">{props.mitem.mitem_cost}</div>
            <div className="mitemComp smallMitemAttr">{props.mitem.mitem_weight}</div>
        </div>
    )
}
