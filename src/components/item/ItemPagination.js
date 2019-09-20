import React, { Component } from 'react';
import '../../assets/css/Pagination.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class ItemPagination extends Component {
    state = {
        currentPage: 1,
        pageStep: 10,
        itemCount: 0,
        currentItemList: { items: [] }
    }

    receiveItemCount = (evt, result) => {
        this.setState({
            ...this.state,
            itemCount: result[0].count,
            currentPage: 1
        })
    }

    componentDidMount() {
        ipcRenderer.send('getItemCount');
        ipcRenderer.on("getItemCountResult", this.receiveItemCount);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getItemCountResult", this.receiveItemCount)
    }

    pageUp = () => {
        let count = Math.ceil(this.state.itemCount / 10);
        let newCount = this.state.currentPage + 1;
        if (newCount <= count) {
            this.setState({
                ...this.state,
                currentPage: (this.state.currentPage + 1)
            });
            ipcRenderer.send('getSearchItems', { step: this.state.pageStep, start: (this.state.currentPage) * this.state.pageStep });
        }
    }
    pageDown = () => {
        if (this.state.currentPage > 1) {
            this.setState({
                ...this.state,
                currentPage: this.state.currentPage - 1
            });
            ipcRenderer.send('getSearchItems', { step: this.state.pageStep, start: (this.state.currentPage - 2) * this.state.pageStep });
        }
    }
    pageJumpTo = (event) => {
        if (!isNaN(event.target.value)) {
            if (event.target.value > 0 && event.target.value <= Math.ceil(this.state.itemCount / 10)) {
                this.setState({
                    ...this.state,
                    currentPage: parseInt(event.target.value)
                });
            }
        }
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            ipcRenderer.send('getSearchItems', { step: this.state.pageStep, start: (this.state.currentPage - 1) * this.state.pageStep });
        }
    }

    changeStep = (e) => {
        this.setState({
            ...this.state,
            pageStep: parseInt(e.target.value),
            currentPage: 1
        });
        ipcRenderer.send('getSearchItems', { step: e.target.value, start: 1 });
    }

    render() {
        return (
            <div id="pagination">
                <div className="pageDown" onClick={this.pageDown}>
                    <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
                </div>
                <div id="pages">
                    <input id="pageInput" type="number" value={this.state.currentPage} min="1"
                        max={Math.ceil(this.state.itemCount / this.state.pageStep)}
                        onChange={this.pageJumpTo}
                        onKeyDown={this.handleKeyDown} />
                    | {Math.ceil(this.state.itemCount / this.state.pageStep)}
                </div>
                <div className="pageUp" onClick={this.pageUp}>
                    <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                </div>
                <div id="step">
                    <select name="stepSelect" onChange={this.changeStep} defaultValue="10">
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>
            </div >
        )
    }
}

export default ItemPagination;