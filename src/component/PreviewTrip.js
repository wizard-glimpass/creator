import { Button } from "@mui/material";
import React from "react";

const PreviewTrip = (props) => {
  const confirmTrip = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props.trip),
    };
    const response = await fetch("http://34.30.247.67/create", requestOptions);
    const data = await response.json();
  };
  return (
    <div>
      {props.trip.map((place) => {
        if (place.name) {
          return <span className="trip-node-ele">{place.name}</span>;
        }
        return <hr />;
      })}

      <Button onClick={confirmTrip}>Confirm Trip</Button>
    </div>
  );
};

export default PreviewTrip;
