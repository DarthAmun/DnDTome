import React from 'react';
import '../../assets/css/char/Char.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Char(props) {

    const getPicture = () => {
        if (props.char.char_pic === "") {
            return icon;
        }
        return props.char.char_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'white'
    };
    return (
        <div className="char" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className="leftChar">
                <div className="charIcon" style={style}></div>
                <div className="charComp">{props.char.char_name}</div>
                <div className="charComp smallText">by {props.char.char_player}</div>
            </div>
            <div className="rightChar">
                <div className="charComp">{props.char.char_classes}</div>
                <div className="charComp">{props.char.char_race}</div>
                <div className="charComp">{props.char.char_background}</div>
                <div className="charComp">Level: {props.char.char_level}</div>
            </div>
        </div>
    )

}
