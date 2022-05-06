import React, { useContext } from "react";
import { context } from "../../../context";
import { setTitle } from "../../../context/reducer/global/actionCreator";
import useMindmap from "../../../customHooks/useMindmap";
import defaultMindmap from "../../../statics/defaultMindmap";
import * as refer from "../../../statics/refer";
import {
  ButtonSet,
  MainButton,
  Shortcut,
  Highlight,
  Annotation,
} from "../common/styledComponents";

const New = ({ handleClosePopup, handleDownload }) => {
  const {
    global: { dispatch },
  } = useContext(context);
  const { setMindmap } = useMindmap();

  const handleNewFile = () => {
    localStorage.removeItem("manualExport");
    setMindmap(defaultMindmap, true);
    dispatch(setTitle(refer.DEFAULT_TITLE));
    handleClosePopup();
  };

  return (
    <div>
      <Highlight>
        After creating a new map, the data of the current mind map will be lost.
      </Highlight>
      <Annotation>
        To save current data, mind map
        <Shortcut onClick={handleDownload}>Download to local</Shortcut>。
      </Annotation>
      <ButtonSet>
        <MainButton onClick={handleNewFile}>New map</MainButton>
        <button onClick={handleClosePopup}>Cancel</button>
      </ButtonSet>
    </div>
  );
};

export default New;
