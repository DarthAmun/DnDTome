import React, { Component } from 'react';
import '../../assets/css/monster/Monster.css';

class Monster extends Component {
    render() {
        return (
            <div className="monster" style={{ animationDelay: `${this.props.delay * 50}ms` }} onClick={this.props.onClick}>
                <div className=""><b>{this.props.monster.monster_name}</b></div>
            </div>
        )
    }
}

export default Monster;