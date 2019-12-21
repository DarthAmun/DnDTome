import React from 'react';
import '../../assets/css/spell/Spell.css';
import icon from '../../assets/img/dice_icon_grey.png';

export default function Spell(props) {

    const formatTime = (value) => {
        let words = value.split(',');
        return words[0];
    }

    const formatLevel = (value) => {
        if (value == "0") {
            return <b>C</b>;
        }
        return value;
    }

    const hasRitual = (value) => {
        if (value === 1) {
            return <div className="icon">R</div>;
        }
        return "";
    }

    const hasConcentration = (value) => {
        let search = value.toLowerCase();
        if (search.includes("concentration")) {
            return <div className="icon">C</div>;
        }
        return "";
    }

    const formatComponents = (value) => {
        let words = value.split('(');
        if (words.length > 1) {
            return words[0] + "*";
        }
        return words[0];
    }

    const formatDuration = (value) => {
        let search = value.toLowerCase();
        if (search.includes("concentration")) {
            if (search.includes("concentration, ")) {
                let words = value.replace("Concentration, ", "");
                return words;
            } else {
                let words = value.replace("Concentration", "");
                return words;
            }
        }
        return value;
    }

    const getPicture = () => {
        if (props.spell.spell_pic === "" || props.spell.spell_pic === null) {
            return icon;
        }
        return props.spell.spell_pic;
    }

    const style = {
        backgroundImage: `url(${getPicture()})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className="spell" style={{ animationDelay: `${props.delay * 50}ms` }} onClick={props.onClick}>
            <div className={`spellSchool spellAttr ${props.spell.spell_school}`}>{props.spell.spell_school}</div>
            <div className="spellLevel spellAttr">{formatLevel(props.spell.spell_level)}</div>
            {hasRitual(props.spell.spell_ritual)}
            {hasConcentration(props.spell.spell_duration)}

            <div className="spellName spellAttr">
                <div className="image" style={style}></div>
                <b>{props.spell.spell_name}</b>
            </div>

            <div className="spellTime smallSpellAttr"><b>Time: </b>{formatTime(props.spell.spell_time)}</div>
            <div className="spellDuration smallSpellAttr"><b>Duration: </b>{formatDuration(props.spell.spell_duration)}</div>
            <div className="spellRange smallSpellAttr"><b>Range: </b>{props.spell.spell_range}</div>
            <div className="spellComp smallSpellAttr"><b>Comp.: </b>{formatComponents(props.spell.spell_components)}</div>
        </div>
    )
}
