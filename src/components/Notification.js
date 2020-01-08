import React, { useState, useEffect } from 'react';
import '../assets/css/Notification.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function Notification() {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [show, setShow] = useState("");

    useEffect(() => {
        ipcRenderer.on("displayMessage", displayMessage);
        return () => {
            ipcRenderer.removeListener("displayMessage", display);
        }
    }, []);

    const displayMessage = (e, result) => {
        setShow("block");
        setType(result.type);
        setMessage(result.message);
        setTimeout(function () {
            setShow("none");
        }, 3000);
    }

    return (
        <div className="notification fade" style={{display: show}}>
            <b><FontAwesomeIcon icon={faExclamationCircle}/> {type}</b><br />
            {message}
        </div>
    )
}