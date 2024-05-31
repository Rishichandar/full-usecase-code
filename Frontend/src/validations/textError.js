import React from "react";

function TextError(props) {
  const color = {
    color: "red",
  };
  return (
    <div className="error" style={color}>
      {props.children}
    </div>
  );
}

export default TextError;
