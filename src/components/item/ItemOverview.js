import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ReactDOM from "react-dom";
import "../../assets/css/item/ItemOverview.css";
import Item from "./Item";
import { reciveItems, reciveItemCount } from "../../database/ItemService";
import ItemSearchBar from "./ItemSearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function ItemOverview() {
  const [currentItemList, setCurrentItemList] = useState({ items: [] });
  const items = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [start, setStart] = useState(0);
  const [query, setQuery] = useState({});

  const receiveItemsResult = result => {
    let newList = currentItemList.items;
    newList = newList.concat(result);

    ReactDOM.unstable_batchedUpdates(() => {
      setCurrentItemList({ items: newList });
      setStart(start + 10);
    });
  };

  const updateItem = (e, result) => {
    let items = currentItemList.items.map(item => {
      if (item.item_id === result.item_id) {
        return result;
      } else {
        return item;
      }
    });
    setCurrentItemList({ items: items });
  };
  const removeWindow = (e, result) => {
    let items = currentItemList.items.filter(item => {
      if (item.item_id !== result.id) return item;
    });
    setCurrentItemList({ items: items });
  };

  const searchItem = (evt, rquery) => {
    setQuery(rquery.query);
    items.current.scrollTop = 0;
    setStart(0);
    reciveItems(10, 0, rquery.query, function(result) {
      receiveItemsResult(result);
    });
  };

  useEffect(() => {
    ipcRenderer.on("sendItemSearchQuery", searchItem);
    return () => {
      ipcRenderer.removeListener("sendItemSearchQuery", searchItem);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on("updateWindow", updateItem);
    return () => {
      ipcRenderer.removeListener("updateWindow", updateItem);
    };
  }, [updateItem]);

  useEffect(() => {
    ipcRenderer.on("removeWindow", removeWindow);
    return () => {
      ipcRenderer.removeListener("removeWindow", removeWindow);
    };
  }, [removeWindow]);


  useEffect(() => {
    if (isFetching) {
      fetchMoreListItems();
    }
  }, [isFetching]);

  useEffect(() => {
    setIsFetching(false);
    reciveItemCount(query, function(result) {
      let itemCount = result.count;
      if (itemCount > currentItemList.items.length) {
        if (!currentItemList.items.length) {
          reciveItems(10, start, query, function(result) {
            receiveItemsResult(result);
          });
        }
        if (items.current.scrollHeight == items.current.clientHeight && currentItemList.items.length) {
          reciveItems(10, start, query, function(items) {
            receiveItemsResult(items);
          });
        }
      }
    });
  }, [currentItemList]);

  const viewItem = item => {
    ipcRenderer.send("openView", item);
  };

  const fetchMoreListItems = () => {
    reciveItems(10, start, query, function(result) {
      receiveItemsResult(result);
    });
  };

  const handleScroll = () => {
    if (Math.round(items.current.offsetHeight + items.current.scrollTop) < items.current.scrollHeight - 240) return;
    setIsFetching(true);
  };

  return (
    <div id="overview">
      <div id="itemsOverview">
        <ItemSearchBar />
        <div id="items" onScroll={handleScroll} ref={items}>
          {currentItemList.items.map((item, index) => {
            return <Item delay={0} item={item} key={item.item_id} onClick={() => viewItem(item)} />;
          })}
        </div>
      </div>
      <Link to={`/add-item`} className="button">
        <FontAwesomeIcon icon={faPlus} /> Add new Magic Item
      </Link>
    </div>
  );
}
