import React from "react";
import modal from "./Modal.module.css";
import SignUpType from "../Form/SignUpType";
import { GrClose } from "react-icons/gr";

function SignUpModal({ onClick, onCloseModal }) {
  return (
    <aside className={`${modal.base} ${modal.member}`}>
      <h2>회원가입</h2>
      <SignUpType
        onCloseModal={onCloseModal}
        style={{ marginBottom: "16px" }}
      />
      <div className={modal.extraButtons}></div>
      <button
        type="button"
        className={`sm-only ${modal.close}`}
        onClick={onClick}
      >
        <GrClose />
      </button>
    </aside>
  );
}

export default SignUpModal;
