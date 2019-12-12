import React from 'react';
import '../../assets/css/gear/Gear.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Gear(props) {

    const getPicture = () => {
        if (props.gear.gear_pic === "" || props.gear.gear_pic === null) {
            return icon;
        }
        return props.gear.gear_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'white'
    };

    return (
        <div className="gear" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className="gearIcon" style={style}></div>
            <div className="gearComp">{props.gear.gear_name}</div>
            <div className="gearComp smallGearAttr">{props.gear.gear_type}</div>
        </div>
    )
}
