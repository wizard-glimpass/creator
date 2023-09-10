import React, { useEffect, useRef, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { NODE_TYPE, ROUTE } from "../utils/constants";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import Compass from "./Compass";
import PreviewTrip from "./PreviewTrip";

const DirectionContainer = () => {
  const [route, setRoute] = useState(ROUTE.NODE_CREATE_FORM);
  const [age, setAge] = React.useState(1);
  const [floor, setFloor] = React.useState(0);
  const [nodeType, setnodeType] = useState(1);
  const [nodeSubType, setnodeSubType] = useState(1);
  const [walkAction, setWalkAction] = useState("startWalk");
  const [isCalibrated, setIsCalibrated] = useState(0);
  const nodeDataRef = useRef({});
  const tripDataRef = useRef([]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleFloorChange = (event) => {
    setFloor(event.target.value);
    nodeDataRef.current["floor"] = event.target.value;
  };
  const handleNodetypeChange = (event) => {
    setnodeType(event.target.value);
    nodeDataRef.current["nodeType"] = event.target.value;
  };
  const handleNodeSubtypeChange = (event) => {
    setnodeSubType(event.target.value);
    nodeDataRef.current["nodeSubType"] = event.target.value;
  };
  const addTripMetaData = (payload) => {
    tripDataRef.current.push(payload);
  };

  const setCalibrated = () => {
    setIsCalibrated((prev) => prev + 1,
  );
    console.log(isCalibrated);
  };

  useEffect(() => {
    if (route !== ROUTE.NODE_CREATE_FORM) {
      tripDataRef.current.push(nodeDataRef.current);
      nodeDataRef.current = {};
    }
  }, [route]);

  return (
    <div>
      {route === ROUTE.NODE_CREATE_FORM && (
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select-node"
            className="form-element"
            value={age}
            label="Select Node"
            onChange={handleChange}
          >
            <MenuItem value={1}>Select node</MenuItem>
            <MenuItem value={10}>Adidas</MenuItem>
            <MenuItem value={20}>Nike</MenuItem>
            <MenuItem value={30}>Cobb</MenuItem>
          </Select>
          <Typography className="typo-ele">OR</Typography>
          <TextField
            className="form-element"
            id="outlined-basic"
            label="Node name"
            variant="outlined"
            onChange={(e) => {
              nodeDataRef.current["name"] = e.target.value;
            }}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select-node-type"
            className="form-element"
            value={nodeType}
            label="Select Node Type"
            onChange={handleNodetypeChange}
          >
            <MenuItem value={1}>Select node type</MenuItem>
            <MenuItem value={NODE_TYPE.SHOP}>Shop</MenuItem>
            <MenuItem value={NODE_TYPE.CHECKPOINT}>Checkpoint</MenuItem>
          </Select>

          {nodeType === NODE_TYPE.SHOP && (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select-node-sub-type"
              className="form-element"
              value={nodeSubType}
              label="Select Sub Node Type"
              onChange={handleNodeSubtypeChange}
            >
              <MenuItem value={1}>Select sub node type</MenuItem>
              <MenuItem value="shop">Shop</MenuItem>
              <MenuItem value="showroom">Showroom</MenuItem>
              <MenuItem value="foodcourt">Foodcourt</MenuItem>
              <MenuItem value="service center">Service center</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          )}

          <Select
            labelId="demo-simple-select-label-floor"
            id="demo-simple-select-floor"
            className="form-element"
            value={floor}
            label="Select Floor"
            onChange={handleFloorChange}
          >
            <MenuItem value={0}>Select floor</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            className="form-element"
            onChange={(e) => {
              setWalkAction(e.target.value);
            }}
          >
            <FormControlLabel
              value="start walking"
              control={<Radio />}
              label="Start walking"
            />
            <FormControlLabel
              value="stop walking"
              control={<Radio />}
              label="Stop walking"
            />
          </RadioGroup>
          {walkAction === "start walking" && (
            <Button
              variant="outlined"
              onClick={() => {
                setRoute(ROUTE.COMPASS);
              }}
            >
              Start Walking
            </Button>
          )}
          {walkAction === "stop walking" && (
            <Button
              onClick={() => {
                setRoute(ROUTE.PREVIEW_TRIP);
              }}
              variant="outlined"
            >
              Preview Trip
            </Button>
          )}
        </FormControl>
      )}
      {route === ROUTE.COMPASS && (
        <Compass
          isCalibrated={isCalibrated}
          setCalibrated={setCalibrated}
          setRoute={setRoute}
          addTripMetaData={addTripMetaData}
        />
      )}
      {route === ROUTE.PREVIEW_TRIP && (
        <PreviewTrip trip={tripDataRef.current} />
      )}
    </div>
  );
};

export default DirectionContainer;
