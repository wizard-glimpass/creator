import React, { useEffect, useRef, useState, useMemo } from "react";
import { ROUTE } from "../utils/constants";
import { MenuItem, Select, Typography, Container } from "@mui/material";
import Compass from "./Compass";
import PreviewTrip from "./PreviewTrip";
import DynamicForm from "./DynamicForm";
import { formFields } from "./helper";

const DirectionContainer = () => {
  const [route, setRoute] = useState(ROUTE.NODE_CREATE_FORM);

  const [compassComp, showCompassComp] = useState(false);
  const [allNodes, setAllNodes] = useState([]);
  const [age, setAge] = React.useState(-1);
  const [isCalibrated, setIsCalibrated] = useState(0);
  const nodeDataRef = useRef({ category: [] });
  const nodeDataRefV2 = useRef({
    nodesData: [],
    completeTrip: [],
  });

  const tripDataRef = useRef([]);
  const defaultVal = useMemo(
    () => formFields("nodeCreateForm", nodeDataRef.current),
    [nodeDataRef.current]
  );

  const getAllNodes = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      `https://app.glimpass.com/graph/get-all-nodes?market=${window.marketSelection}`,
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
    const cachedTrip = localStorage.getItem("tripData");
    if (cachedTrip) {
      nodeDataRefV2.current = JSON.parse(cachedTrip);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tripData", JSON.stringify(nodeDataRefV2.current));
  }, [nodeDataRefV2.current]);

  const handleChange = (event) => {
    setAge(event.target.value);
    nodeDataRef.current = allNodes[event.target.value];
  };

  const addTripMetaData = (payload) => {
    tripDataRef.current.push(payload);
  };

  const setCalibrated = () => {
    setIsCalibrated((prev) => (prev + 1 > 4 ? prev : prev + 1));
  };

  const modifyTripData = (type, tripData) => {
    let newdata;
    if (type === "nodeForm") {
      const prevData = nodeDataRefV2.current.nodesData;
      prevData.push(tripData);
      newdata = {
        ...nodeDataRefV2.current,
        nodesData: prevData,
      };
    } else if (type === "compass") {
      const prevData = nodeDataRefV2.current.nodesData;
      const lastIndex = prevData.length - 1;
      if (lastIndex >= 0) {
        prevData[lastIndex] = prevData[lastIndex].filter((item) => {
          return item.name !== "steps" && item.name !== "angle";
        });

        prevData[lastIndex].push(tripData[0]);
        prevData[lastIndex].push(tripData[1]);
      }

      newdata = {
        ...nodeDataRefV2.current,
        nodesData: prevData,
      };
    } else if (type === "shopAngle") {
      const prevData = nodeDataRefV2.current.nodesData;
      const lastIndex = prevData.length - 1;
      if (lastIndex >= 0) {
        prevData[lastIndex].push(tripData);
      }

      newdata = {
        ...nodeDataRefV2.current,
        nodesData: prevData,
      };
    } else if (type === "checkpoint") {
      const prevData = nodeDataRefV2.current.nodesData;
      prevData.push(tripData);
      newdata = {
        ...nodeDataRefV2.current,
        nodesData: prevData,
      };
    } else if (type === "delete") {
      let prevData = nodeDataRefV2.current.nodesData;
      prevData.splice(tripData, 1);
      newdata = {
        ...nodeDataRefV2.current,
        nodesData: prevData,
      };
    } else if (type === "update") {
    }

    nodeDataRefV2.current = newdata;
  };
  const addCheckpoint = (steps, angle) => {
    addTripMetaData({
      angle: parseInt(angle),
      steps: steps,
      label: "RELATED_TO",
    });
    nodeDataRef.current["nodeType"] = "checkpoint";
    nodeDataRef.current["name"] = new Date().toString();
    const checkpointData = [
      {
        name: "name",
        label: "Node name",
        type: "text",
        value: new Date().toString(),
      },
      {
        name: "nodeType",
        label: "Node Type",
        type: "select",
        value: "checkpoint",
        options: ["checkpoint"],
      },

      {
        name: "floor",
        label: "Floor",
        type: "select",
        value: 3,
        options: ["-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5"],
      },
    ];

    const stepsObj = {
      name: "steps",
      label: "Steps",
      type: "text",
      value: steps,
    };

    const angleObj = {
      name: "angle",
      label: "Angle",
      type: "text",
      value: parseInt(angle),
    };
    modifyTripData("compass", [stepsObj, angleObj]);
    modifyTripData("checkpoint", checkpointData);
    tripDataRef.current.push(nodeDataRef.current);
    nodeDataRef.current = {};
  };

  useEffect(() => {
    if (route !== ROUTE.NODE_CREATE_FORM) {
      setAge(-1);
    }
    if (route === ROUTE.COMPASS) {
      showCompassComp(true);
    } else {
      showCompassComp(false);
    }
  }, [route]);

  const actionBtn = {
    primary: {
      text: "Start walking",
      action: () => {
        if (nodeDataRef.current["name"]) {
          tripDataRef.current.push(nodeDataRef.current);
        }
        nodeDataRef.current = { category: [] };

        setRoute(ROUTE.COMPASS);
      },
    },
    secondary: {
      text: "Preview trip",
      action: () => {
        if (nodeDataRef.current["name"]) {
          tripDataRef.current.push(nodeDataRef.current);
        }
        nodeDataRef.current = { category: [] };
        setRoute(ROUTE.PREVIEW_TRIP);
      },
      isSubmit: false,
    },
  };
  return (
    <div>
      {route === ROUTE.NODE_CREATE_FORM && (
        <>
          <Container>
            <Select
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
          </Container>

          <DynamicForm
            modifyTripData={modifyTripData}
            actionBtn={actionBtn}
            intialFields={defaultVal}
            renderComp="nodeForm"
          />
        </>
      )}

      <Compass
        isCalibrated={isCalibrated}
        setCalibrated={setCalibrated}
        setRoute={setRoute}
        addTripMetaData={addTripMetaData}
        addCheckpoint={addCheckpoint}
        showComp={compassComp}
        modifyTripData={modifyTripData}
      />

      {route === ROUTE.PREVIEW_TRIP && (
        <PreviewTrip
          trip={tripDataRef.current}
          setRoute={setRoute}
          modifyTripData={modifyTripData}
          allNodesData={nodeDataRefV2.current}
        />
      )}
    </div>
  );
};

export default DirectionContainer;
