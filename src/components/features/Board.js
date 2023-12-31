import React from "react";
import board from "./Board.module.css";

function Board({ list, onClick, title }) {
  return (
    <ul className={board.table}>
      <li className={board.tableHeader}>
        <h3>{title}</h3>
        <h3 className="lg-only">날짜</h3>
        <div className="lg-only"></div>
      </li>
      {list.map((item) => {
        return (
          <li className={board.tableBody} key={item.title}>
            <button
              type="button"
              className={board.title}
              onClick={() => onClick(item.id)}
            >
              {item.title}
            </button>
            <span className={`lg-only ${board.date}`}>{item.date}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default Board;
