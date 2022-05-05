import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ label, bool, setBool }) => {
  //   console.log(bool);
  return (
    <div className="container">
      {label}{" "}
      <div className="toggle-switch">
        <input
          onChange={() => {
            setBool(!bool);
          }}
          type="checkbox"
          className="checkbox"
          name={label}
          id={label}
        />
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
