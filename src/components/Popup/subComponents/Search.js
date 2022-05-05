import React, { useState, useEffect, useContext } from "react";
import { context } from "../../../context";
import { css } from "emotion";
import useMindmap from "../../../customHooks/useMindmap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

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

const Search = ({ handleClosePopup }) => {
  const {
    mindmap: { state: mindmap },
  } = useContext(context);
  const { selectNode, clearNodeStatus } = useMindmap();

  const [keyword, onChangeKeyword] = useState("");
  const [searchList, onChangeSearchList] = useState([]);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    clearNodeStatus();
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
        changeCursorIndex(-1);
      } else if (e.key === "ArrowDown") {
        changeCursorIndex(1);
      }
    }
  };

  const onClickListitem = (nodeId) => {
    selectNode(nodeId);
    handleClosePopup();
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

  return (
    <div>
      <h2>Search</h2>
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
          {searchList.map((item, index) => (
            <li
              className={index === cursor ? list_hover : null}
              key={index}
              onMouseOver={() => setCursor(index)}
              onClick={() => {
                onClickListitem(item.nodeId);
              }}
            >
              {item.content.length >= 50
                ? item.content.slice(0, 50) + "..."
                : item.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;

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

const previous_next_btn = css`
  top: 100%;
  width: 10%;
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
const nxtandprev = css`
   {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;
