import React, { Component } from 'react';
import '../../assets/css/monster/Monster.css';

class Monster extends Component {
    formatType = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    formatSubType = (value) => {
        if (value == "") {
            return "";
        } else {
            return " (" + value + ")";
        }
    }

    render() {
        const style = {
            backgroundImage: `url(${this.props.monster.monster_pic})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div className="monster" style={{ animationDelay: `${this.props.delay * 50}ms` }} onClick={this.props.onClick}>
                <div className="monsterAttr monsterType">
                    <b>{this.formatType(this.props.monster.monster_type)}</b>
                    {this.formatSubType(this.props.monster.monster_subtype)}
                </div>
                <div className="monsterAttr monsterLevel">{this.props.monster.monster_cr}</div>
                <div className="monsterIcon" style={style}></div>

                <div className="monsterAttr monsterName"><b>{this.props.monster.monster_name}</b></div>

                <div className="smallMonsterAttr"><b>Alignment: </b>{this.props.monster.monster_alignment}</div>
                <div className="smallMonsterAttr"><b>Size: </b>{this.props.monster.monster_size}</div>
            </div>
        )
    }
}

export default Monster;