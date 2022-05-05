import React, { Suspense, lazy } from "react";
import { css } from "emotion";
import * as popupType from "./common/popupType";
import { handlePropagation } from "../../methods/assistFunctions";
import New from "./subComponents/New";
import Open from "./subComponents/Open";
import Theme from "./subComponents/Theme";
import Search from "./subComponents/Search";
import Export from "./subComponents/Export";
const getContentComponent = (type) => {
  switch (type) {
    case popupType.NEW:
      return New;
    case popupType.OPEN:
      return Open;
    case popupType.EXPORT:
      return Export;
    case popupType.THEME:
      return Theme;
    case popupType.SEARCH:
      return Search;
    default:
      return;
  }
};

const Popup = ({
  type,
  handleClosePopup,
  handleDownload,
  displayMan,
  setDisplayMan,
}) => {
  const Content = getContentComponent(type);
  return (
    <div className={wrapper} onClick={handlePropagation}>
      <div
        className={content_wrapper}
        style={
          type === popupType.SEARCH || (displayMan && type === popupType.EXPORT)
            ? {
                top: "15%",
                marginRight: "1%",
                border: "1px solid rgba(0, 0, 0, 0.04)",
                boxShadow: "0 16px 24px 2px rgba(0, 0, 0, 0.14)",
              }
            : null
        }
      >
        <i
          className={"zwicon-close-circle " + close_button}
          onClick={handleClosePopup}
        />
        <Suspense fallback={<></>}>
          <Content
            displayMan={displayMan}
            setDisplayMan={setDisplayMan}
            handleClosePopup={handleClosePopup}
            handleDownload={handleDownload}
          />
        </Suspense>
      </div>
      <div
        className={overlay}
        style={
          type === popupType.SEARCH || (displayMan && type === popupType.EXPORT)
            ? { opacity: 0 }
            : null
        }
        onClick={handleClosePopup}
      />
    </div>
  );
};

export default Popup;

// CSS
const wrapper = css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const content_wrapper = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  width: 400px;
  margin: auto;
  padding: 40px 40px 20px;
  font-size: 1rem;
  background-color: #ffffff;
  border-radius: 20px;
  z-index: 1;
`;

const close_button = css`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 25px;
  font-weight: 700;

  &:active {
    transform: scale(0.95);
  }
`;

const overlay = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000000;
  opacity: 0.2;
`;
