// src/GifSlideshow.js
import React, { useState } from "react";
import { Button } from "@mui/material";

const gifs = [
  "https://media.giphy.com/media/l0ErFafpUCQTkqsQE/giphy.gif",
  "https://media.giphy.com/media/26Ff5evMweBsENWqk/giphy.gif",
  "https://media.giphy.com/media/1d7F9xyq6j7C1ojbC5/giphy.gif",
  // ... more GIF URLs
];

const instructions = [
  {
    title: "Please walk towards to the shop",
    description: "Heads up your device towards shop gate !",
  },
  {
    title: "Open your compass app in device and heads up to NORTH direction",
    description: "Heads up your device towards shop gate !",
  },
  {
    title: "Press on Calibrate button to start ",
    description: "Heads up your device towards shop gate !",
  },
];

function GifSlideshow({ requestPermission }) {
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
            ? requestPermission
            : handleNext
        }
      >
        {currentIndex !== instructions.length - 1 ? "Next" : "Calibrate"}
      </Button>
    </div>
  );
}

export default GifSlideshow;
