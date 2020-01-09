import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router"
import '../assets/css/LeftNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMeteor, faIdCard, faShieldAlt, faDiceD20, faCog, faDragon, faFistRaised } from '@fortawesome/free-solid-svg-icons';
import Particles from 'react-particles-js';
import backpackIcon from "../assets/img/backpack.png";
import raceIcon from "../assets/img/orc-head.png";
import encounterIcon from "../assets/img/sword-clash.png";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class LeftNav extends Component {
  render() {

    const closeActiveView = () => {
      ipcRenderer.send('closeActiveView');
    }

    return (
      <div id="leftNav">
        <Particles className="particlesWrapper" params={{
          "particles": {
            "number": {
              "value": 160,
              "density": {
                "enable": true,
                "value_area": 400
              }
            },
            "color": {
              "value": "#ffffff"
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000000"
              },
              "polygon": {
                "nb_sides": 5
              },
              "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
              }
            },
            "opacity": {
              "value": 1,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0,
                "sync": false
              }
            },
            "size": {
              "value": 2,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 4,
                "size_min": 0.3,
                "sync": false
              }
            },
            "line_linked": {
              "enable": false,
              "distance": 150,
              "color": "#ffffff",
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 1,
              "direction": "none",
              "random": true,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 600
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": false,
                "mode": "bubble"
              },
              "onclick": {
                "enable": false,
                "mode": "repulse"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 400,
                "line_linked": {
                  "opacity": 1
                }
              },
              "bubble": {
                "distance": 250,
                "size": 0,
                "duration": 2,
                "opacity": 0,
                "speed": 3
              },
              "repulse": {
                "distance": 400,
                "duration": 0.4
              },
              "push": {
                "particles_nb": 4
              },
              "remove": {
                "particles_nb": 2
              }
            }
          },
          "retina_detect": true
        }} />
        <div className="gradIcon">
          <FontAwesomeIcon icon={faDiceD20} className="smallIcon" />
        </div>
        <Link onClick={e => closeActiveView()} to="/spell-overview" style={{ top: "70px" }} className={this.props.location.pathname == "/spell-overview" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <FontAwesomeIcon icon={faMeteor} /> Spells
          </div>
        </Link>
        <Link onClick={e => closeActiveView()} to="/item-overview" style={{ top: "110px" }} className={this.props.location.pathname == "/item-overview" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <FontAwesomeIcon icon={faShieldAlt} /> Magic Items
          </div>
        </Link>
        <Link onClick={e => closeActiveView()} to="/gear-overview" style={{ top: "150px" }} className={this.props.location.pathname == "/gear-overview" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <img src={backpackIcon} style={{ width: '20px', marginTop: '10px', marginRight: '5px', float: 'left' }} /> Equip
          </div>
        </Link>
        <Link onClick={e => closeActiveView()} to="/race-overview" style={{ top: "190px" }} className={this.props.location.pathname == "/race-overview" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <img src={raceIcon} style={{ width: '20px', marginTop: '10px', marginRight: '5px', float: 'left' }} /> Races
          </div>
        </Link>
        <Link onClick={e => closeActiveView()} to="/char-overview" style={{ top: "230px" }} className={this.props.location.pathname == "/char-overview" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <FontAwesomeIcon icon={faIdCard} /> Chars
          </div>
        </Link>
        <Link onClick={e => closeActiveView()} to="/monster-overview" style={{ top: "270px" }} className={this.props.location.pathname == "/monster-overview" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <FontAwesomeIcon icon={faDragon} /> Monsters
          </div>
        </Link>
        <div className="seperator" style={{ top: "315px" }}></div>
        <Link onClick={e => closeActiveView()} to="/encounters" style={{ top: "330px" }} className={this.props.location.pathname == "/encounters" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <img src={encounterIcon} style={{ width: '20px', marginTop: '10px', marginRight: '5px', float: 'left' }} /> Encounters
          </div>
        </Link>
        <Link onClick={e => closeActiveView()} to="/options" style={{ bottom: "5px" }} className={this.props.location.pathname == "/options" ? "menuItemActiv" : ""}>
          <div className="menuItem">
            <FontAwesomeIcon icon={faCog} /> Options
          </div>
        </Link>
        <svg width="0" height="0">
          <radialGradient id="rgg" r="150%" cx="30%" cy="107%">
            <stop stopColor="#350069" offset="0" />
            <stop stopColor="#B973FF" offset="0.9" />
          </radialGradient>
        </svg>
      </div>
    )
  }
}

export default withRouter(LeftNav);