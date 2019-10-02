import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/char/Char.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

class Char extends Component {

    render() {
        return (
            <Link to={`/char/${this.props.char.char_id}`}>
                <div className="char" style={{ animationDelay: `${this.props.delay * 50}ms` }}>
                    <div className="addIcon"><FontAwesomeIcon icon={faUserCircle} /></div>
                    <div className="charComp smallCharAttr">{this.props.char.char_name}</div>
                    <div className="charComp smallCharAttr">{this.props.char.char_player}</div>
                </div>
            </Link>
        )
    }
}

export default Char;