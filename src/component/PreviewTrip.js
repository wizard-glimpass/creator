import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ROUTE } from "../utils/constants";

const PreviewTrip = (props) => {
  const [graphCreated, setGraphcreated] = useState(false);
  const confirmTrip = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props.trip),
    };
    const response = await fetch(
      "https://app.glimpass.com/graph/create",
      requestOptions
    );
    const data = await response.json();
    setGraphcreated(true);
    props.setRoute(ROUTE.NODE_CREATE_FORM);
  };

  const getAllNodes = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      "https://app.glimpass.com/graph/get-all-nodes",
      requestOptions
    );
  };
  useEffect(() => {
    getAllNodes();
  }, []);
  return (
    <div>
      {props.trip.map((place, index) => {
        return (
          <div>
            <span className="trip-node-ele">{place.name}</span>
            {index + 1 < props.trip.length && (
              <span className="trip-node-ele">
                {props.trip[index + 1].angle}
              </span>
            )}
          </div>
        );
      })}

      <Button onClick={confirmTrip}>Confirm Trip</Button>
    </div>
  );
};

export default PreviewTrip;
