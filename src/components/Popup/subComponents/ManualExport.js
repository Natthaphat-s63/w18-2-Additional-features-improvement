import React, { useState, useEffect, useContext } from "react";
import { context } from "../../../context";
import { css } from "emotion";
import useMindmap from "../../../customHooks/useMindmap";
import gen_powerpoint from "./Gen_slide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
var DFS = [];
const structDFS = (data, parent) => {
  let obj = {
    id: data.id,
    title: data.text,
    haveChild: data.children.length !== 0 ? true : false,
    childContent:
      data.children.length !== 0
        ? data.children.map((child) => child.text)
        : [],
    childID:
      data.children.length !== 0 ? data.children.map((child) => child.id) : [],
    parent: parent,
  };
  DFS.push(obj);
  if (data.children.length > 0) {
    let parent_tmp = data.text;
    data.children.forEach((elem) => {
      structDFS(elem, parent_tmp);
    });
  } else {
    return;
  }
};
const refreshSearchList = (keyword, mindmap) => {
  var searchList = [];
  const traverseMindmap = (node) => {
    const content = node.text;
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      searchList.push({
        content: content,
        nodeId: node.id,
      });
    }
    node.children.forEach((childNode) => {
      traverseMindmap(childNode);
    });
  };
  traverseMindmap(mindmap);

  return searchList;
};
function areEqual(array1, array2) {
  if (array1.length === array2.length) {
    return array1.every((element, index) => {
      if (element === array2[index]) {
        return true;
      }
      return false;
    });
  }
  return false;
}
const ManualExport = ({ handleClosePopup }) => {
  const {
    mindmap: { state: mindmap },
  } = useContext(context);
  const { selectNode, clearNodeStatus } = useMindmap();

  const [keyword, onChangeKeyword] = useState("");
  const [searchList, onChangeSearchList] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [checkedState, setCheckedState] = useState();
  const [Idcheck, setIdCheck] = useState();
  const [disableState, setDisableState] = useState();
  useEffect(() => {
    clearNodeStatus();
    if (mindmap.check && mindmap.dis && mindmap.idlist) {
      let obj = {
        check: mindmap.check,
        dis: mindmap.dis,
        idlist: mindmap.idlist,
      };
      localStorage.setItem("manualExport", JSON.stringify(obj));
    }
  }, []);
  useEffect(() => {
    DFS = [];
    structDFS(mindmap, mindmap.title);
    let list = DFS;
    let id = [];
    list.forEach((e) => {
      id.push(e.id);
    });
    let checkList = null;
    let disableList = null;
    let idList = null;
    if (localStorage.getItem("manualExport")) {
      checkList = JSON.parse(localStorage.getItem("manualExport")).check;
      disableList = JSON.parse(localStorage.getItem("manualExport")).dis;
      idList = JSON.parse(localStorage.getItem("manualExport")).idlist;
      if (checkList && disableList && idList) {
        if (areEqual(id, idList)) {
          setCheckedState(checkList);
          setDisableState(disableList);
        } else {
          setCheckedState(new Array(list.length).fill(true));
          setDisableState(new Array(list.length).fill(false));
        }
      }
    } else {
      setCheckedState(new Array(list.length).fill(true));
      setDisableState(new Array(list.length).fill(false));
    }

    setIdCheck(id);
  }, []);
  useEffect(() => {
    onChangeSearchList(refreshSearchList(keyword, mindmap));
    setCursor(0);
  }, [keyword]);

  const changeCursorIndex = (adder) => {
    if (cursor === 0 && adder === -1) {
      setCursor(searchList.length - 1);
    } else if (cursor === searchList.length - 1 && adder === 1) {
      setCursor(0);
    } else {
      setCursor(cursor + adder);
    }
  };

  const _handleSearch = (e) => {
    if (searchList.length !== 0) {
      if (e.key === "Enter") {
        onClickListitem(searchList[cursor].nodeId);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        changeCursorIndex(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        changeCursorIndex(1);
      }
    }
  };

  const onClickListitem = (nodeId) => {
    selectNode(nodeId);
    //handleClosePopup();
  };

  const onClick_Previous_Next_Btn = (adder) => {
    changeCursorIndex(adder);
    if (cursor + adder === searchList.length) {
      selectNode(searchList[0].nodeId);
      return;
    } else if (cursor + adder === -1) {
      selectNode(searchList[searchList.length - 1].nodeId);
      return;
    }
    selectNode(searchList[cursor + adder].nodeId);
  };

  const handleOnChange = (position) => {
    let updateArr = [...checkedState];
    let updateDis = [...disableState];
    let recursiveCount = 0;
    FillDFS();
    const recursiveCheck = (idx, state) => {
      recursiveCount++;
      updateArr[idx] = !state;
      if (recursiveCount > 1) {
        updateDis[idx] = state;
      }
      if (DFS[idx].haveChild) {
        for (let k = 0; k < DFS[idx].child_index.length; k++) {
          recursiveCheck(DFS[idx].child_index[k], state);
        }
      }
      return;
    };
    recursiveCheck(position, checkedState[position]);
    setCheckedState(updateArr);
    setDisableState(updateDis);
  };

  useEffect(() => {
    let obj = { check: checkedState, dis: disableState, idlist: Idcheck };
    let mindmap_json = JSON.parse(localStorage.getItem("mindmap"));
    mindmap_json.idlist = Idcheck;
    mindmap_json.check = checkedState;
    mindmap_json.dis = disableState;
    localStorage.setItem("manualExport", JSON.stringify(obj));
    localStorage.setItem("mindmap", JSON.stringify(mindmap_json));
  }, [checkedState, disableState, Idcheck]);

  const FillDFS = () => {
    DFS = [];
    structDFS(mindmap, mindmap.text);

    var id_DFS = [];
    for (let i = 0; i < DFS.length; i++) {
      id_DFS.push(DFS[i].id);
      DFS[i]["use"] = checkedState[i];
    }
    for (let l = 0; l < DFS.length; l++) {
      let childuse = [];
      let childidx = [];

      DFS[l].childID.forEach((elem) => {
        childidx.push(id_DFS.indexOf(elem));
        if (DFS[l].use) {
          childuse.push(DFS[id_DFS.indexOf(elem)].use);
        } else {
          childuse.push(false);
          DFS[id_DFS.indexOf(elem)].use = false;
        }
      });
      DFS[l]["child_use"] = childuse;
      DFS[l]["child_index"] = childidx;
    }
  };
  const handleManualGen = (e) => {
    FillDFS();
    //console.log(DFS);
    gen_powerpoint.gen_powerpoint(DFS);
  };
  return (
    <div>
      <h2>Custom Slide</h2>
      <p style={{ color: "#E33B17" }}>
        P.S. content will not be included in slides if its parent is not
        included.{" "}
      </p>
      <input
        autoFocus={true}
        className={searchbox}
        type="text"
        name="keyword"
        placeholder="Search..."
        autoComplete="off"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        onKeyDown={_handleSearch}
      />
      <div style={{ margin: "10px 10px" }} className={nxtandprev}>
        <FontAwesomeIcon
          onClick={() => {
            onClick_Previous_Next_Btn(-1);
          }}
          icon={faAngleUp}
          style={{ fontSize: "23px", marginLeft: "4px", marginRight: "15px" }}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          onClick={() => {
            onClick_Previous_Next_Btn(1);
          }}
          icon={faAngleDown}
          style={{ fontSize: "23px", marginLeft: "4px", marginRight: "15px" }}
        ></FontAwesomeIcon>
        {searchList.length === 0 ? cursor : cursor + 1}/{searchList.length}
      </div>
      <div className={dropdown}>
        <ul>
          <li style={{ display: "inline-flex", width: "100%" }}>
            <p style={{ fontWeight: "bold", flex: 2 }}>Node</p>
            <p
              style={{
                fontWeight: "bold",
                flex: 1,
                textAlign: "center",
              }}
            >
              Include
            </p>
          </li>
          {searchList.map((item, index) => (
            <li
              className={index === cursor ? list_hover : null}
              key={index}
              style={{ display: "inline-flex", width: "100%" }}
              onMouseOver={() => {
                setCursor(index);
              }}
            >
              <div
                onClick={() => {
                  onClickListitem(item.nodeId);
                }}
                style={{ flex: 2 }}
              >
                {item.content.length >= 50
                  ? item.content.slice(0, 50) + "..."
                  : item.content}
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  disabled={
                    disableState[Idcheck.indexOf(searchList[index].nodeId)]
                  }
                  type="checkbox"
                  checked={
                    checkedState[Idcheck.indexOf(searchList[index].nodeId)]
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    handleOnChange(Idcheck.indexOf(searchList[index].nodeId));
                  }}
                  style={{ transform: "scale(2)" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={button} style={{ marginTop: "25px" }}>
        <button onClick={handleManualGen}>Export to PowerPoint</button>
      </div>
    </div>
  );
};
export default ManualExport;

// CSS
const searchbox = css`
  top: 100%;
  left: 0;
  width: 100%;

  padding: 0.625em;
  box-sizing: border-box;
  box-shadow: 0 0.125em 0.3125em rgba($black, 0.3);

  display: block;
  justify-content: center;
`;
const list_hover = css`
  background-color: rgba(237, 169, 56, 0.14);
  cursor: pointer;
`;

const dropdown = css`
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  overflow-y: auto;
  max-height: 350px;
  ul {
    margin: 0;
    padding: 0;
    font-size: 90%;
    list-style: none;

    li {
      line-height: 2em;
      padding: 8px 12px;
    }
  }
`;

const button = css`
  button {
    background-color: #fff;
    border: 1px solid #d5d9d9;
    border-radius: 18px;
    box-shadow: rgba(213, 217, 217, 0.5) 0 2px 5px 0;
    box-sizing: border-box;
    color: #0f1111;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    line-height: 36px;
    padding: 0 10px 0 11px;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    width: 50%;
  }

  button:hover {
    background-color: #f7fafa;
  }

  button:focus {
    border-color: #008296;
    box-shadow: rgba(213, 217, 217, 0.5) 0 2px 5px 0;
    outline: 0;
  }
`;
const nxtandprev = css`
   {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;
