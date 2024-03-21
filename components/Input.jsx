import React from "react";

const Input = ({ placeHolder, handleClick, value }) => {
  return (
    <div className="form-group label-floating is-empty">
      <input
        type="text"
        className="form-control input--squared input--dark"
        placeholder={placeHolder}
        onChange={handleClick}
        value={value}
      />
    </div>
  );
};

export default Input;
