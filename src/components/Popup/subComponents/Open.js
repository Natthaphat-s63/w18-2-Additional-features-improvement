import React, { useContext } from "react";
import { css } from "emotion";
import { context } from "../../../context";
import { setTitle } from "../../../context/reducer/global/actionCreator";
import useMindmap from "../../../customHooks/useMindmap";
import { ROOT_NODE_ID } from "../../../statics/refer";
import mindmapParser from "../../../methods/mindmapParser";
import {
  ButtonSet,
  MainButton,
  Shortcut,
  Highlight,
  Annotation,
} from "../common/styledComponents";

const Open = ({ handleClosePopup, handleDownload }) => {
  const {
    global: { dispatch },
  } = useContext(context);
  const { setMindmap } = useMindmap();

  const handleOpenFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.km,.txt,.md";
    input.addEventListener("change", (event) => {
      const file = event.target.files[0],
        file_name = file.name;
      let dot_index = file_name.length - 1;
      while (dot_index > 0 && file_name[dot_index] !== ".") {
        dot_index--;
      }
      const format = file_name.slice(dot_index + 1).toUpperCase(),
        title = file_name.slice(0, dot_index);
      const file_reader = new FileReader();
      file_reader.onload = (event) => {
        const str = event.target.result;
        const mindmap = mindmapParser(str, format);
        if (mindmap && mindmap.id === ROOT_NODE_ID) {
          setMindmap(mindmap, true);
          dispatch(setTitle(title));
          handleClosePopup();
        } else {
          alert("Invalid mind map file");
        }
      };
      file_reader.readAsText(file);
    });
    input.click();
  };

  return (
    <div>
      <Highlight>
        After opening other files, the data of the current mind map will be
        lost.
      </Highlight>
      <Annotation>
        To save current data, mind map
        <Shortcut onClick={handleDownload}>Download to local</Shortcut>。
      </Annotation>
      <p className={sub_title}>Open format supported：</p>
      <ul className={list_wrapper}>
        <li>JSON（.json）</li>
        <li>Baidu brain map（.km）</li>
        <li>Markdown（.md）</li>
        <li>Text file（.txt）</li>
      </ul>
      <ButtonSet>
        <MainButton onClick={handleOpenFile}>Open a file</MainButton>
        <button onClick={handleClosePopup}>Cancel</button>
      </ButtonSet>
    </div>
  );
};

export default Open;

// CSS
const sub_title = css`
  margin: 20px 0 5px;
  padding-bottom: 8px;
  border-bottom: 1px solid #dddddd;
`;

const list_wrapper = css`
  margin: 0;
  padding: 0;
  font-size: 90%;
  list-style: circle inside;

  li {
    line-height: 2em;
  }
`;
