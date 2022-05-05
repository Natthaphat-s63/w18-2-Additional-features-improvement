import React, { useState, useContext, useEffect } from "react";
import { css } from "emotion";
import { context } from "../../context";
import useMindmap from "../../customHooks/useMindmap";
import useHistory from "../../customHooks/useHistory";
import useZoom from "../../customHooks/useZoom";
import useMove from "../../customHooks/useMove";
import * as refer from "../../statics/refer";
import * as popupType from "../../components/Popup/common/popupType";
import { handlePropagation, downloadFile } from "../../methods/assistFunctions"; // 防止 Mindmap 中的选中状态由于冒泡被清除
import ToolButton from "../../components/ToolButton";
import MindmapTitle from "../../components/MindmapTitle";
import Popup from "../../components/Popup";

const Nav = () => {
  const [popup, setPopup] = useState(popupType.NONE);
  const {
    mindmap: { state: mindmap },
    history: { state: history },
    global: {
      state: { title },
    },
  } = useContext(context);
  const [displayMan, setDisplayMan] = useState(false); // true = showpopup
  const { expandAll } = useMindmap();
  const { zoomIn, zoomOut, zoomReset } = useZoom();
  const { moveXY, moveReset } = useMove();
  const { undoHistory, redoHistory } = useHistory();

  useEffect(() => {
    const handleShotcut = (event) => {
      const is_on_mac = navigator.platform.toUpperCase().startsWith("MAC");
      const combine_key_pressed = is_on_mac ? event.metaKey : event.ctrlKey;
      if (combine_key_pressed && event.code === "KeyF") {
        event.preventDefault();
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleShotcut);
    return () => {
      window.removeEventListener("keydown", handleShotcut);
    };
  }, []);

  const handleClosePopup = () => {
    setPopup(popupType.NONE);
    setDisplayMan(false);
  };

  const handleNewFile = () => {
    setPopup(popupType.NEW);
  };

  const handleDownload = () => {
    const url = `data:text/plain,${encodeURIComponent(
      JSON.stringify(mindmap)
    )}`;
    downloadFile(url, `${title}.json`);
  };

  const handleOpenFile = () => {
    setPopup(popupType.OPEN);
  };

  const handleExport = () => {
    setPopup(popupType.EXPORT);
  };

  const handleTheme = () => {
    setPopup(popupType.THEME);
  };

  const handleUndo = () => {
    undoHistory();
  };

  const handleRedo = () => {
    redoHistory();
  };

  const handleExpand = () => {
    expandAll(refer.ROOT_NODE_ID);
  };

  const handleZoom = (zoom) => {
    console.log("zoom", zoom ? zoom : "reduction");
    switch (zoom) {
      case "in":
        zoomIn();
        break;
      case "out":
        zoomOut();
        break;
      default:
        zoomReset();
    }
  };

  const handleSearch = () => {
    setPopup(popupType.SEARCH);
  };

  const handleMove = (move) => {
    console.log("move", move ? move : "reduction");
    switch (move) {
      case "up":
        moveXY(0, -5);
        break;
      case "down":
        moveXY(0, 5);
        break;
      case "left":
        moveXY(-5, 0);
        break;
      case "right":
        moveXY(5, 0);
        break;
      default:
        moveReset();
    }
  };

  return (
    <nav className={wrapper}>
      <section className={section} onClick={handlePropagation}>
        <ToolButton icon={"add-item-alt"} onClick={handleNewFile}>
          New
        </ToolButton>
        <ToolButton icon={"folder-open"} onClick={handleOpenFile}>
          Open
        </ToolButton>
        <ToolButton icon={"duplicate"} onClick={handleExport}>
          Export
        </ToolButton>
        <ToolButton icon={"palette"} onClick={handleTheme}>
          Theme
        </ToolButton>
        <ToolButton icon={"plus-circle"} onClick={() => handleZoom("in")}>
          in
        </ToolButton>
        <ToolButton icon={"minus-circle"} onClick={() => handleZoom("out")}>
          out
        </ToolButton>
        <ToolButton icon={"rotate-left"} onClick={() => handleZoom()}>
          Reset Zoom
        </ToolButton>
        <ToolButton icon={"search"} onClick={() => handleSearch()}>
          Search
        </ToolButton>
      </section>
      <section className={section}>
        <MindmapTitle />
      </section>
      <section className={section} onClick={handlePropagation}>
        <ToolButton icon={"rotate-left"} onClick={() => handleMove()}>
          Reset Move
        </ToolButton>
        <ToolButton icon={"arrow-left"} onClick={() => handleMove("left")}>
          Left
        </ToolButton>
        <ToolButton icon={"arrow-up"} onClick={() => handleMove("up")}>
          Up
        </ToolButton>
        <ToolButton icon={"arrow-down"} onClick={() => handleMove("down")}>
          Down
        </ToolButton>
        <ToolButton icon={"arrow-right"} onClick={() => handleMove("right")}>
          Right
        </ToolButton>
        <ToolButton
          icon={"undo"}
          disabled={history.undo.length === 0}
          onClick={handleUndo}
        >
          Undo
        </ToolButton>
        <ToolButton
          icon={"redo"}
          disabled={history.redo.length === 0}
          onClick={handleRedo}
        >
          Redo
        </ToolButton>
        <ToolButton icon={"scale"} onClick={handleExpand}>
          Expand
        </ToolButton>
      </section>
      {popup !== popupType.NONE && (
        <Popup
          displayMan={displayMan}
          setDisplayMan={setDisplayMan}
          type={popup}
          handleClosePopup={handleClosePopup}
          handleDownload={handleDownload}
        />
      )}
    </nav>
  );
};

export default Nav;

// CSS
const wrapper = css`
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding: 40px 50px;
  font-size: 50px;
  background-color: #ffffff;
  box-shadow: 0 0px 2px #aaaaaa;
  z-index: 10;
`;

const section = css`
  display: flex;
`;
