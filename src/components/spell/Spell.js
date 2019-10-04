import React, { Component } from 'react';
import '../../assets/css/spell/Spell.css';

class Spell extends Component {

    formatTime = (value) => {
        let words = value.split(',');
        return words[0];
    }

    formatLevel = (value) => {
        if (value == "0") {
            return <b>C</b>;
        }
        return value;
    }

    hasRitual = (value) => {
        if (value == '1') {
            return <div className="icon">R</div>;
        }
        return "";
    }
    hasConcentration = (value) => {
        let search = value.toLowerCase();
        if (search.includes("concentration")) {
            return <div className="icon">C</div>;
        }
        return "";
    }


    formatComponents = (value) => {
        let words = value.split('(');
        if (words.length > 1) {
            return words[0] + "*";
        }
        return words[0];
    }

    formatDuration = (value) => {
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

    formatDurationIcon = (value) => {
        let search = value.toLowerCase();
        if (search.includes("concentration")) {
            if (search.includes("concentration, ")) {
                return <img className="icon" src={conc_image_src} alt="Conc." />;
            } else {
                return <img className="icon" src={conc_image_src} alt="Conc." />;
            }
        }
        return '';
    }

    formatConstlyIcon = (value) => {
        let search = value.match("(\\d+\\sgp)|(\\d+,\\d+\\sgp)");
        if (search != null) {
            return <img className="icon" src={cost_image_src} alt="Conc." />
        }

        return '';
    }

    render() {
        return (
            <div className="spell" style={{ animationDelay: `${this.props.delay * 50}ms` }} onClick={this.props.onClick}>
                <div className={`spellSchool spellAttr ${this.props.spell.spell_school}`}>{this.props.spell.spell_school}</div>
                <div className="spellLevel spellAttr">{this.formatLevel(this.props.spell.spell_level)}</div>
                {this.hasRitual(this.props.spell.spell_ritual)}
                {this.hasConcentration(this.props.spell.spell_duration)}

                <div className="spellName spellAttr"><b>{this.props.spell.spell_name}</b></div>

                <div className="spellTime smallSpellAttr"><b>Time: </b>{this.formatTime(this.props.spell.spell_time)}</div>
                <div className="spellDuration smallSpellAttr"><b>Duration: </b>{this.formatDuration(this.props.spell.spell_duration)}</div>
                <div className="spellRange smallSpellAttr"><b>Range: </b>{this.props.spell.spell_range}</div>
                <div className="spellComp smallSpellAttr"><b>Comp.: </b>{this.formatComponents(this.props.spell.spell_components)}</div>
            </div>
        )
    }
}

export default Spell;