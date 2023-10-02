// src/CardItem.js
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function CardItem({ card, onClick }) {
  return (
    <Card
      onClick={onClick}
      style={{ cursor: "pointer", maxWidth: "345px", margin: "16px" }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {card[0].value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CardItem;
