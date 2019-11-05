import React from 'react';
import { Link } from 'react-router-dom';
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
        backgroundRepeat: 'no-repeat'
    };
    return (
        <Link to={`/char/${props.char.char_id}`}>
            <div className="char" style={{ animationDelay: `${props.delay * 50}ms` }}>
                <div className="charIcon" style={style}></div>
                <div className="charComp">{props.char.char_name}</div>
