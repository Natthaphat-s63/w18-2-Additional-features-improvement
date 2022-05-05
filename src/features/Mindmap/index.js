import React, { useEffect, useContext, useRef, useMemo, useState } from "react";
import { css } from "emotion";
import * as refer from "../../statics/refer";
import { context } from "../../context/";
import { setHistory } from "../../context/reducer/history/actionCreator";
import useMindmap from "../../customHooks/useMindmap";
import useHistory from "../../customHooks/useHistory";
import getKeydownEvent from "../../methods/getKeydownEvent";
import RootNode from "../../components/RootNode";
import DragCanvas from "../../components/DragCanvas";
import LineCanvas from "../../components/LineCanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpDownLeftRight,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import ToolButton from "../../components/ToolButton";
const node_refs = new Set();

const Mindmap = ({ container_ref }) => {
  const self = useRef();
  const {
    mindmap: { state: root_node },
    nodeStatus: { state: nodeStatus },
    history: { dispatch: hDispatch },
    global: { state: gState },
  } = useContext(context);
  const [eye, setEye] = useState(true);
  const historyHook = useHistory();
  const mindmapHook = useMindmap();

  const { clearNodeStatus } = mindmapHook;
  const [FLAG, setFLAG] = useState(0);

  const mindmap_json = useMemo(() => JSON.stringify(root_node), [root_node]);

  const handleResize = () => {
    setFLAG(Date.now());
  };
  useEffect(() => {
    const handleKeydown = getKeydownEvent(nodeStatus, mindmapHook, historyHook);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [nodeStatus]);

  useEffect(() => {
    window.addEventListener("click", clearNodeStatus);
    return () => {
      window.removeEventListener("click", clearNodeStatus);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem("mindmap", mindmap_json);
    hDispatch(
      setHistory(mindmap_json, nodeStatus.cur_select || nodeStatus.cur_edit)
    );
  }, [mindmap_json]);

  return (
    <div>
      <div
        style={{
          top: "100px",
          right: "50px",
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: "130px",
        }}
      >
        <h6
          style={{
            marginBottom: "auto",
            justifyContent: "center",
            alignItems: "center",
            opacity: eye ? 0.45 : 0,
            fontSize: "20px",
          }}
        >
          Alt + Left Mouse or Middle mouse to move freely
          <FontAwesomeIcon
            icon={faArrowsUpDownLeftRight}
            style={{
              fontSize: "22px",
              marginLeft: "5px",
              alignItems: "center",
              verticalAlign: "middle",
              opacity: eye ? 0.45 : 0,
            }}
          ></FontAwesomeIcon>
        </h6>
        <h6
          style={{
            marginTop: "auto",
            justifyContent: "center",
            alignItems: "center",
            opacity: eye ? 0.45 : 0,
            fontSize: "20px",
          }}
        >
          Scroll wheel to zoom
          <FontAwesomeIcon
            icon={faMagnifyingGlassPlus}
            style={{
              fontSize: "22px",
              marginLeft: "5px",
              alignItems: "center",
              verticalAlign: "middle",
              opacity: eye ? 0.45 : 0,
            }}
          ></FontAwesomeIcon>
        </h6>
        <div
          style={{
            fontSize: "40px",
            verticalAlign: "middle",
            position: "absolute",
            top: "50px",
            left: "-70px",
            zIndex: "1",
          }}
        >
          <ToolButton
            onClick={() => {
              setEye(!eye);
            }}
            icon={eye ? "eye" : "eye-slash"}
          ></ToolButton>
        </div>
      </div>
      <div
        className={wrapper}
        ref={self}
        style={{
          zoom: gState.zoom,
          left: gState.x + "vw",
          top: gState.y + "vh",
        }}
        id={refer.MINDMAP_ID}
        draggable={false}
      >
        <RootNode
          key={root_node.id}
          layer={0}
          node={root_node}
          node_refs={node_refs}
        />
        <DragCanvas
          parent_ref={self}
          container_ref={container_ref}
          mindmap={root_node}
        />
        <LineCanvas
          parent_ref={self}
          mindmap={root_node}
          node_refs={node_refs}
        />
      </div>
    </div>
  );
};

export default Mindmap;

// CSS
const wrapper = css`
  position: relative;
  width: fit-content;
  padding: 30vh 30vw;
`;
