import React, { useState } from "react";
import card from "./Card.module.css";

function Card({ place, onClick, inquiryCounting }) {
  const [inquiryCount, setInquiryCount] = useState(0);
  const handleImageClick = () => {
    setInquiryCount(inquiryCount + 1);
    onClick();
  };

  return (
    <li className={card.item} key={place.name}>
      <div className={card.image}>
        {inquiryCounting ? (
          <img src={place.image} alt={place.name} onClick={handleImageClick} />
        ) : (
          <img src={place.image} alt={place.name} />
        )}
      </div>
      {inquiryCounting && (
        <h4 className={card.inquiry}>조회: {inquiryCount}</h4>
      )}
      <h4 className={card.name}>{place.name}</h4>
      <span className={card.nickName}>{place.nickName}</span>
      <span className={card.date}>{place.date}</span>
      <address className={card.address}>{place.address}</address>
    </li>
  );
}

export default Card;
