import React from "react";
import form from "./Form.module.css";
import Mini from "../Button/Mini";

function ButtonType({ placeholder, onClick, onChange, value }) {
  return (
    <div className={form.buttonType}>
      <input
        className={form.base}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Mini text="중복확인" color="gray" onClick={onClick} />
    </div>
  );
}

export default ButtonType;
