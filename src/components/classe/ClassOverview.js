import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ReactDOM from "react-dom";
import "../../assets/css/classe/ClassOverview.css";
import Classe from "./Classe";
import ClassSearchBar from "./ClassSearchBar";
import { reciveClasss, reciveClassCount } from "../../database/ClassService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function ClassOverview() {
  const [currentClassList, setCurrentClassList] = useState({ classes: [] });
  const classes = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [start, setStart] = useState(0);
  const [query, setQuery] = useState({});

  const receiveClasssResult = result => {
    let newList = currentClassList.classes;
    newList = newList.concat(result);

    ReactDOM.unstable_batchedUpdates(() => {
      setCurrentClassList({ classes: newList });
      setStart(start + 10);
    });
  };

  const updateClass = () => {
    classes.current.scrollTop = 0;
    setStart(10);
    reciveClasss(10, 0, query, function(result) {
      receiveClasssResult(result);
    });
  };

  const searchClass = (evt, rquery) => {
    setQuery(rquery.query);
    classes.current.scrollTop = 0;
    setStart(0);
    reciveClasss(10, 0, rquery.query, function(result) {
      receiveClasssResult(result);
    });
  };

  useEffect(() => {
    ipcRenderer.on("classesUpdated", updateClass);
    ipcRenderer.on("sendClassSearchQuery", searchClass);
    return () => {
      ipcRenderer.removeListener("classesUpdated", updateClass);
      ipcRenderer.removeListener("sendClassSearchQuery", searchClass);
    };
  }, []);

  useEffect(() => {
    if (isFetching) {
      fetchMoreListItems();
    }
  }, [isFetching]);

  useEffect(() => {
    setIsFetching(false);

    reciveClassCount(query, function(result) {
      let classeCount = result.count;
      if (classeCount > currentClassList.classes.length) {
        if (!currentClassList.classes.length) {
          reciveClasss(10, start, query, function(result) {
            receiveClasssResult(result);
          });
        }
        if (classes.current.scrollHeight == classes.current.clientHeight && currentClassList.classes.length) {
          reciveClasss(10, start, query, function(classes) {
            receiveClasssResult(classes);
          });
        }
      }
    });
  }, [currentClassList]);

  const viewClass = classe => {
    ipcRenderer.send("openView", classe);
  };

  const fetchMoreListItems = () => {
    reciveClasss(10, start, query, function(result) {
      receiveClasssResult(result);
    });
  };

  const handleScroll = () => {
    if (Math.round(classes.current.offsetHeight + classes.current.scrollTop) < classes.current.scrollHeight - 240) return;
    setIsFetching(true);
  };

  return (
    <div id="overview">
      <div id="classeOverview">
        <ClassSearchBar />
        <div id="classes" onScroll={handleScroll} ref={classes}>
          {currentClassList.classes.map((classe, index) => {
            return <Classe delay={0} classe={classe} key={classe.classe_id} onClick={() => viewClass(classe)} />;
          })}
        </div>
      </div>
      <Link to={`/add-classe`} className="button">
        <FontAwesomeIcon icon={faPlus} /> Add new Class
      </Link>
    </div>
  );
}
