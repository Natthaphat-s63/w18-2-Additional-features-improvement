import React, { useContext, useState, useEffect } from "react";
import { css } from "emotion";
import { context } from "../../../context";
import useMindmap from "../../../customHooks/useMindmap";
import * as refer from "../../../statics/refer";
import html2canvas from "html2canvas";
import { downloadFile } from "../../../methods/assistFunctions";
import mindmapExporter from "../../../methods/mindmapExporter";
import { Highlight, ButtonSet } from "../common/styledComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePowerpoint } from "@fortawesome/free-solid-svg-icons";
// import pptxgen from "pptxgenjs";
import ToggleSwitch from "../../Switch/ToggleSwitch";
import ManualExport from "./ManualExport";
import gen_powerpoint from "./Gen_slide";
const Export = ({ handleClosePopup, displayMan, setDisplayMan }) => {
  const {
    mindmap: { state: mindmap },
    global: {
      state: { title },
    },
  } = useContext(context);
  const { clearNodeStatus } = useMindmap();
  const [statePPTX, setStatePPTX] = useState(true); // true = auto, false = manual
  const handleExportPNG = () => {
    clearNodeStatus();
    html2canvas(document.getElementById(refer.MINDMAP_ID)).then((canvas) => {
      let url = canvas.toDataURL("image/png");
      downloadFile(url, `${title}.png`);
    });
  };

  const handleExportText = (format) => {
    const data = mindmapExporter(mindmap, format);
    let url = `data:text/plain,${encodeURIComponent(data)}`;
    downloadFile(url, `${title}.${format.toLowerCase()}`);
  };
  var DFS = [];
  const structDFS = (data, parent) => {
    let obj = {
      id: data.id,
      title: data.text,
      haveChild: data.children.length != 0 ? true : false,
      childContent:
        data.children.length != 0
          ? data.children.map((child) => child.text)
          : [],
      parent: parent,
      use: true,
      child_use:
        data.children.length != 0
          ? new Array(data.children.length).fill(true)
          : [],
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
  const handleExportPPTX = (e) => {
    let json = mindmap;
    if (statePPTX) {
      structDFS(json, json.text);
      gen_powerpoint.gen_powerpoint(DFS);
    } else {
      setDisplayMan(true);
    }
  };
  const handleDownload = () => {
    const url = `data:text/plain,${encodeURIComponent(
      JSON.stringify(mindmap)
    )}`;
    downloadFile(url, `${title}.json`);
  };
  return (
    <div>
      {!displayMan ? (
        <div>
          <Highlight>Please select an export format：</Highlight>
          <ul className={list_wrapper}>
            <li style={{ display: "inline-flex", width: "100%" }}>
              <div
                style={{ width: "100%", flex: 1, paddingTop: "13px" }}
                onClick={handleExportPPTX}
              >
                <FontAwesomeIcon
                  icon={faFilePowerpoint}
                  style={{
                    fontSize: "26px",
                    marginLeft: "4px",
                    marginRight: "15px",
                  }}
                ></FontAwesomeIcon>
                PowerPoint (.pptx)
              </div>
              <div
                style={{
                  width: "100%",
                  flex: 1,
                }}
              >
                <ToggleSwitch
                  style={{ marginBottom: "100px" }}
                  label="Auto sorting"
                  bool={statePPTX}
                  setBool={setStatePPTX}
                />
              </div>
            </li>
            <li onClick={handleDownload}>
              <i className={"zwicon-file-download"} />
              Json file（.json）
            </li>
            <li onClick={handleExportPNG}>
              <i className={"zwicon-file-image"} />
              PNG image（.png）
            </li>
            <li
              onClick={() => {
                handleExportText("KM");
              }}
            >
              <i className={"zwicon-file-pdf"} />
              Baidu brain map（.km）
            </li>
            <li
              onClick={() => {
                handleExportText("MD");
              }}
            >
              <i className={"zwicon-file-table"} />
              Markdown（.md）
            </li>
            <li
              onClick={() => {
                handleExportText("TXT");
              }}
            >
              <i className={"zwicon-file-font"} />
              Text file（.txt）
            </li>
          </ul>
          <ButtonSet>
            <button onClick={handleClosePopup}>Finish</button>
          </ButtonSet>
        </div>
      ) : (
        <div>
          <ManualExport handleClosePopup={handleClosePopup} />
        </div>
      )}
    </div>
  );
};

export default Export;

// CSS
const list_wrapper = css`
  padding: 0;
  list-style: none;

  li {
    padding: 5px 0 5px 5px;
    border-left: 3px solid transparent;
    border-bottom: 1px solid #dddddd;
    line-height: 30px;
    cursor: pointer;
  }

  li:last-of-type {
    border-bottom: none;
  }

  li:hover {
    border-left: 3px solid var(${refer.THEME_EX});
  }

  li i {
    margin-right: 10px;
    font-size: 30px;
  }
`;
