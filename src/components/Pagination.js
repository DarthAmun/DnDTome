import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Pagination.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function Pagination({ name }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageStep, setPageStep] = useState(10);
    const [count, setCount] = useState(0);
    const [maxPages, setMaxPages] = useState(0);

    useEffect(() => {
        ipcRenderer.send(`get${name}Count`);
        ipcRenderer.on(`get${name}CountResult`, receiveCount);
        return () => {
            ipcRenderer.removeListener(`get${name}CountResult`, receiveCount);
        }
    }, []);

    const receiveCount = (evt, result) => {
        setCount(result[0].count);
        setCurrentPage(1);
        setMaxPages(Math.ceil(result[0].count / pageStep));

    }

    const pageUp = () => {
        let count = maxPages;
        let newCount = currentPage + 1;
        if (newCount <= count) {
            setCurrentPage(newCount);
            ipcRenderer.send(`getSearch${name}s`, { step: pageStep, start: (currentPage * pageStep) });
        }
    }
    const pageDown = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            ipcRenderer.send(`getSearch${name}s`, { step: pageStep, start: ((currentPage - 2) * pageStep) });
        }
    }
    const pageJumpTo = (e) => {
        if (!isNaN(e.target.value)) {
            if (e.target.value > 0 && e.target.value <= maxPages) {
                setCurrentPage(parseInt(e.target.value));
            }
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            ipcRenderer.send(`getSearch${name}s`, { step: pageStep, start: ((currentPage - 1) * pageStep) });
        }
    }

    const changeStep = (e) => {
        setPageStep(parseInt(e.target.value));
        setCurrentPage(1);
        setMaxPages(Math.ceil(count / parseInt(e.target.value)));
        ipcRenderer.send(`getSearch${name}s`, { step: e.target.value, start: 0 });
    }

    return (
        <div id="pagination">
            <div className="pageDown" onClick={pageDown}>
                <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
            </div>
            <div id="pages">
                <input id="pageInput" type="number" value={currentPage} min="1"
                    max={maxPages}
                    onChange={pageJumpTo}
                    onKeyDown={handleKeyDown} />
                / {Math.ceil(count / pageStep)}
            </div>
            <div className="pageUp" onClick={pageUp}>
                <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
            </div>
            <div id="step">
                <select name="stepSelect" onChange={changeStep} defaultValue="10">
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                </select>
            </div>
            <div className="delimiter">|</div>
            <Link to={`/add-${name}`} className="button">
                <FontAwesomeIcon icon={faPlus} /> Add new {name}
            </Link>
        </div >
    )
}