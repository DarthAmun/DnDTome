import React from 'react';
import '../../assets/css/race/Race.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Race(props) {

    const getPicture = () => {
        if (props.race.race_pic === "" || props.race.race_pic === null) {
            return icon;
        }
        return props.race.race_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className="race" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className="raceName raceAttr">
                <b>{props.race.race_name}</b><br />
            </div>
            <div className="image" style={style}></div>
            <div className="spellComp smallSpellAttr">{props.race.race_abilityScoreImprov}</div>
        </div>
    )
}
