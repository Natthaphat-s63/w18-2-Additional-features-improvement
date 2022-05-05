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
import { debounce } from "../../methods/assistFunctions";
const Nav = () => {
  const zoomHook = useZoom();
  const moveHook = useMove();
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
  const [popupOver, setPopupOver] = useState(false);
  const [navOver, setNavOver] = useState(false);
  var mouseDown = false;
  var prevX = 0;
  var prevY = 0;
  const handleMouseDown = (e) => {
    // 0 =left 1=middile 2=right
    e.stopPropagation();
    if (e.button === 1 || (e.altKey && e.button === 0)) {
      mouseDown = true;
    }
  };
  const handleMouseUp = (e) => {
    e.stopPropagation();
    if (e.button === 1 || e.button === 0) {
      mouseDown = false;
      prevX = 0;
      prevY = 0;
    }
  };
  const handleMouseMove = (e) => {
    if (mouseDown && !(popupOver || navOver)) {
      const normalizeXY = window.innerWidth / window.innerHeight;
      let moveXAmount = 0;
      let moveYAmount = 0;
      if (prevX > 0 || prevY > 0) {
        moveXAmount += e.pageX - prevX;
        moveYAmount += e.pageY - prevY;
      }
      prevX = e.pageX;
      prevY = e.pageY;
      moveHook.moveXY(moveXAmount / 10 / normalizeXY, moveYAmount / 10);
    }
  };
  const getWheelDelta = (e) => {
    if (e.wheelDelta) {
      return e.wheelDelta;
    } else {
      return -e.wheelDelta * 40;
    }
  };
  const handleScroll = (e) => {
    if (e.wheelDelta && !popupOver && !navOver) {
      e.stopPropagation();
      getWheelDelta(e) > 0
        ? zoomHook.zoomIn(e.clientX, e.clientY)
        : zoomHook.zoomOut(e.clientX, e.clientY);
      return;
    }
  };
  useEffect(() => {
    let element = window; //document.getElementById(refer.MINDMAP_MAIN);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("wheel", handleScroll);
    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("wheel", handleScroll);
    };
  }, [popupOver, navOver]);

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
  // console.log("nav:" + navOver + "popup" + popupOver);
  return (
    <nav className={wrapper}>
      <div
        className={wrapper}
        onMouseOver={() => {
          setNavOver(true);
        }}
        onMouseLeave={() => {
          setNavOver(false);
        }}
      >
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
      </div>
      {popup !== popupType.NONE && (
        <div>
          <Popup
            displayMan={displayMan}
            setPopupOver={setPopupOver}
            setDisplayMan={setDisplayMan}
            type={popup}
            handleClosePopup={handleClosePopup}
            handleDownload={handleDownload}
          />
        </div>
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
