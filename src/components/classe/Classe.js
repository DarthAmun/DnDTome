import React from 'react';
import '../../assets/css/classe/Classe.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Classe(props) {

    const getPicture = () => {
        if (props.classe.classe_pic === "" || props.classe.classe_pic === null) {
            return icon;
        }
        return props.classe.classe_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className="classe" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className="classeName classeAttr">
                <b>{props.classe.classe_name}</b><br />
            </div>
            <div className="image" style={style}></div>
        </div>
    )
}
