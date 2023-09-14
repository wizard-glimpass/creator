import React, { useEffect, useRef, useState } from "react";
import FormControl from "@mui/material/FormControl";
import { NODE_TYPE, ROUTE } from "../utils/constants";
import {
  Button,
  Checkbox,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import Compass from "./Compass";
import PreviewTrip from "./PreviewTrip";

const DirectionContainer = () => {
  const [route, setRoute] = useState(ROUTE.NODE_CREATE_FORM);
  const [allNodes, setAllNodes] = useState([]);
  const [age, setAge] = React.useState(-1);
  const [floor, setFloor] = React.useState(0);
  const [nodeType, setnodeType] = useState(1);
  const [nodeSubType, setnodeSubType] = useState(1);
  const [isCalibrated, setIsCalibrated] = useState(0);
  const nodeDataRef = useRef({ category: [] });
  const tripDataRef = useRef([]);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const getAllNodes = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      "https://app.glimpass.com/graph/get-all-nodes",
      requestOptions
    );

    response.json().then((data) => {
      const allNodesData = [];
      Object.keys(data).map((d) => {
        allNodesData.push(data[d]);
      });

      setAllNodes(allNodesData);
    });
  };
  useEffect(() => {
    getAllNodes();
  }, []);

  const handleChange = (event) => {
    setAge(event.target.value);
    nodeDataRef.current = allNodes[event.target.value];
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
    setIsCalibrated((prev) => prev + 1);
  };

  const addCheckpoint = (steps, angle) => {
    addTripMetaData({
      angle: parseInt(angle),
      steps: steps,
      label: "RELATED_TO",
    });
    nodeDataRef.current["nodeType"] = "checkpoint";
    nodeDataRef.current["name"] = new Date().toString();
    tripDataRef.current.push(nodeDataRef.current);
    nodeDataRef.current = {};

    console.log(tripDataRef);
  };

  useEffect(() => {
    if (route !== ROUTE.NODE_CREATE_FORM) {
      setAge(-1);
      setFloor(0);
      setnodeType(1);
      setnodeSubType(1);
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
            <MenuItem value={-1}>Select node</MenuItem>
            {allNodes.map((node, index) => {
              return <MenuItem value={index}>{node.name}</MenuItem>;
            })}
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

            <MenuItem value={NODE_TYPE.FLOOR_CHANGE}>Floor Change</MenuItem>
            <MenuItem value={NODE_TYPE.GATE}>Gate</MenuItem>
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

          <FormGroup className="manish" style={{ background: "none" }}>
            <FormControlLabel
              control={
                <Checkbox
                  value="clothes"
                  onChange={(e) => {
                    nodeDataRef.current["category"] = [
                      ...nodeDataRef.current["category"],
                      e.target.value,
                    ];
                  }}
                />
              }
              label="Clothes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    nodeDataRef.current["category"] = [
                      ...nodeDataRef.current["category"],
                      e.target.value,
                    ];
                  }}
                  value="food"
                />
              }
              label="Food"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    nodeDataRef.current["category"] = [
                      ...nodeDataRef.current["category"],
                      e.target.value,
                    ];
                  }}
                  value="games"
                />
              }
              label="Games"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    nodeDataRef.current["category"] = [
                      ...nodeDataRef.current["category"],
                      e.target.value,
                    ];
                  }}
                  value="xyz"
                />
              }
              label="xyz"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    nodeDataRef.current["category"] = [
                      ...nodeDataRef.current["category"],
                      e.target.value,
                    ];
                  }}
                  value="pqrs"
                />
              }
              label="pqrs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    nodeDataRef.current["category"] = [
                      ...nodeDataRef.current["category"],
                      e.target.value,
                    ];
                  }}
                  value="good"
                />
              }
              label="good"
            />
          </FormGroup>
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
          <div className="button-container">
            <Button
              variant="outlined"
              onClick={() => {
                tripDataRef.current.push(nodeDataRef.current);
                nodeDataRef.current = { category: [] };

                setRoute(ROUTE.COMPASS);
              }}
            >
              Start Walking
            </Button>

            <Button
              onClick={() => {
                tripDataRef.current.push(nodeDataRef.current);
                nodeDataRef.current = { category: [] };
                setRoute(ROUTE.PREVIEW_TRIP);
              }}
              variant="outlined"
            >
              Preview Trip
            </Button>
          </div>
        </FormControl>
      )}
      {route === ROUTE.COMPASS && (
        <Compass
          isCalibrated={isCalibrated}
          setCalibrated={setCalibrated}
          setRoute={setRoute}
          addTripMetaData={addTripMetaData}
          addCheckpoint={addCheckpoint}
        />
      )}
      {route === ROUTE.PREVIEW_TRIP && (
        <PreviewTrip trip={tripDataRef.current} setRoute={setRoute} />
      )}
    </div>
  );
};

export default DirectionContainer;
