// src/GifSlideshow.js
import React, { useState } from "react";
import { Button } from "@mui/material";

const instructions = [
  {
    title: "Head up toward shop gate ",
    description: "Click on submit button to submit shop angle!",
  },
];

function Calibrate({ modifyTripData, currentAngle, setClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % instructions.length);
  };

  return (
    <div>
      <h2 id="parent-modal-title">{instructions[currentIndex].title}</h2>
      <p id="parent-modal-description">
        {instructions[currentIndex].description}
      </p>
      <Button
        variant="outlined"
        onClick={
          currentIndex == instructions.length - 1
            ? () => {
                const d = {
                  name: "shop_angle",
                  label: "ShopAngle",
                  type: "text",
                  value: 360 - currentAngle,
                };
                modifyTripData("shopAngle", d);
                setClose();
              }
            : handleNext
        }
      >
        {currentIndex !== instructions.length - 1 ? "Next" : "Calibrate"}
      </Button>
    </div>
  );
}

export default Calibrate;
