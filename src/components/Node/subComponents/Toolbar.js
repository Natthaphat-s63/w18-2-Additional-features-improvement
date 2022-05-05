import React from "react";
import { css } from "emotion";
import useMindmap from "../../../customHooks/useMindmap";
import useEditPanel from "../../../customHooks/useEditPanel";
import { handlePropagation } from "../../../methods/assistFunctions";
import ToolButton from "../../ToolButton";

const Toolbar = ({ layer, node, parent }) => {
  const mindmapHook = useMindmap();
  const editPanelHook = useEditPanel();

  const handleAddChild = () => {
    mindmapHook.addChild(node.id);
  };

  const handleAddSibling = () => {
    mindmapHook.addSibling(node.id, parent.id);
  };

  const handleDeleteNode = () => {
    mindmapHook.deleteNode(node.id, parent.id);
  };

  const handleEditNode = () => {
    mindmapHook.editNode(node.id);
  };

  const handleToggleChildren = () => {
    mindmapHook.toggleChildren(node.id, !node.showChildren);
  };

  const handleAddInfo = () => {
    mindmapHook.selectNode(node.id);
    editPanelHook.toggelPanelShow(true);
  };

  return (
    <div className={wrapper} onClick={handlePropagation}>
      <ToolButton icon={"git-commit"} onClick={handleAddChild}>
        Add child node
      </ToolButton>
      <ToolButton
        icon={"git-fork"}
        onClick={handleAddSibling}
        disabled={layer < 1}
      >
        Add sibling node
      </ToolButton>
      <ToolButton
        icon={"delete"}
        onClick={handleDeleteNode}
        disabled={layer < 1}
      >
        Delete
      </ToolButton>
      <ToolButton icon={"edit-pencil"} onClick={handleEditNode}>
        Edit
      </ToolButton>
      <ToolButton icon={"edit-pencil"} onClick={handleAddInfo}>
        Add note
      </ToolButton>
      <ToolButton
        icon={"split-v"}
        onClick={handleToggleChildren}
        disabled={layer < 1 || node.children.length === 0}
      >
        Explicit and hidden child node
      </ToolButton>
    </div>
  );
};

export default Toolbar;

// CSS
const wrapper = css`
  display: flex;
  position: absolute;
  bottom: calc(100% + 5px);
  left: 0;
  background-color: #ffffff;
  width: max-content;
  height: 80px;
  padding: 0 8px;
  font-size: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #aaaaaa;
`;
