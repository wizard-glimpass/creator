import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ROUTE } from "../utils/constants";

import CardList from "./CardList";
import { prepareTripData } from "./helper";

const PreviewTrip = (props) => {
  const confirmTrip = async () => {
    const resp = prepareTripData(props.allNodesData);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resp),
    };
    const response = await fetch(
      "https://app.glimpass.com/graph/create",
      requestOptions
    );
    const data = await response.json();
    props.setRoute(ROUTE.NODE_CREATE_FORM);
    localStorage.setItem(
      "tripData",
      JSON.stringify({
        nodesData: [],
        completeTrip: [],
      })
    );
  };

  const getAllNodes = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      `https://app.glimpass.com/graph/get-all-nodes?market=${window.marketSelection}`,
      requestOptions
    );
  };

  const backToForm = () => {
    props.setRoute(ROUTE.NODE_CREATE_FORM);
  };

  useEffect(() => {
    getAllNodes();
  }, []);

  return (
    <div>
      <CardList
        cardData={props.allNodesData.nodesData}
        modifyTripData={props.modifyTripData}
      />

      <Button onClick={backToForm}>Back</Button>
      <Button onClick={confirmTrip}>Confirm Trip</Button>
    </div>
  );
};

export default PreviewTrip;
