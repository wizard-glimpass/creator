// src/Compass.js

import React, { useState, useEffect, useRef } from "react";
import "./Compass.css";
import { Box, Button, Modal } from "@mui/material";
import { inertialFrame } from "./helper";
import { ROUTE } from "../utils/constants";

function Compass(props) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  ///////////////////////

  const [dy, setdy] = useState(0);

  const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const accRef = useRef();
  const distRef = useRef(0);

  //changes for speed

  const prev_force = useRef(0);
  const final_force = useRef(0);

  const prev_time = useRef(Date.now());

  const final = useRef(0);
  const push = useRef(0);
  const steps = useRef(0);
  const push_y = useRef(0);
  const travel = useRef(0);
  const travel_state = useRef(0);

  const omega_a = useRef(0);
  const omega_a_p = useRef(0);
  const omega_max_p = useRef(0);
  const omega_max = useRef(0);

  //////////////////////
  const [alpha, setAlpha] = useState(0);

  const offset = useRef(0);
  const [isWalking, setIsWalking] = useState(true);
  const [alphaSum, setAlphaSum] = useState(0);
  const [alphaReadingsCounted, setAlphaReadingsCounted] = useState(0);

  const sendAngleStepsPayload = () => {
    const avgAlpha = alphaSum / alphaReadingsCounted;
    props.setRoute(ROUTE.NODE_CREATE_FORM);
    props.addTripMetaData({
      angle: parseInt(avgAlpha),
      steps: dy,
      label: "RELATED_TO",
    });
  };
  const handleWalkingToggle = () => {
    // When stopping walking
    const avgAlpha = alphaSum / alphaReadingsCounted;

    window.alert(
      `Steps Counted: ${dy}\nAverage Alpha(Node is at): ${parseInt(avgAlpha)}`
    );
    setIsWalking(false);
    setAlphaSum(0);
    setAlphaReadingsCounted(1);
    sendAngleStepsPayload();
  };
  const handleMotion = (event) => {
    accRef.current = event.acceleration;

    const timeInterval = 0;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    // Do stuff with the new orientation data

    //LowPass filteredData

    const acc_th = 0.1;
    const time_th = 0.3;
    const travel_th = 4;

    let accn_x = parseInt(event.acceleration.x);
    if (Math.abs(accn_x) < acc_th) {
      accn_x = 0;
    }
    let accn_y = parseInt(event.acceleration.y);
    if (Math.abs(accn_y) < acc_th) {
      accn_y = 0;
    }
    let accn_z = parseInt(event.acceleration.z);
    if (Math.abs(accn_z) < acc_th) {
      accn_z = 0;
    }

    const sin_a = parseInt(dirRef.current.alpha); // * (Math.PI / 180))
    const sin_b = parseInt(dirRef.current.beta); // * (Math.PI / 180))
    const sin_g = parseInt(dirRef.current.gamma); // * (Math.PI / 180))
    const rate_a = parseInt(event.rotationRate.alpha);
    const rate_c = parseInt(event.rotationRate.gamma);

    if (accn_y < 0) {
      final_force.current += Math.abs(accn_y);
    }
    //windows.alert(sin_b)
    final.current = inertialFrame(
      sin_a * (Math.PI / 180),
      sin_b * (Math.PI / 180),
      sin_g * (Math.PI / 180),
      accn_x,
      accn_y,
      accn_z
    );

    //push implementation
    const timeDiff = (Date.now() - prev_time.current) / 1000;
    if (final.current[2] > 0) {
      if (push.current < 1) {
        push.current += 0.334;
      }

      if (accn_y < 0 && push_y.current < 1) {
        push_y.current += 0.334;
      }

      if (push_y.current >= 1 && timeDiff > time_th) {
        push_y.current = 1;
        travel.current += 1;
      }
      if (travel.current >= travel_th) {
        travel_state.current = 1;
      }

      final_force.current = Math.max(final.current[2], final_force.current);
      omega_max.current = Math.max(Math.abs(rate_c), omega_max.current);
      omega_a.current = Math.max(Math.abs(rate_a), omega_a.current);

      if (
        push.current >= 1 &&
        timeDiff > time_th &&
        (push_y.current >= 1 || travel_state.current == 1)
      ) {
        if (
          (omega_max.current < 50 && omega_max.current > 10) ||
          travel_state.current == 0
        ) {
          steps.current += 1;
          push.current = 1;
          prev_time.current = Date.now();

          if (omega_a.current > 0) {
            omega_a_p.current = omega_a.current;
          }
          omega_a.current = 0;

          if (omega_max.current > 0) {
            omega_max_p.current = omega_max.current;
          }
          omega_max.current = 0;

          if (final_force.current > 0) {
            prev_force.current = final_force.current;
          }
          final_force.current = 0;
        } else {
          if (omega_max.current > 0) {
            omega_max_p.current = omega_max.current;
          }
          omega_max.current = 0;
        }
      }
    }

    if (final.current[2] <= 0) {
      push.current -= 0.51;
      if (push.current < 0) {
        push.current = 0;
        push_y.current = 0;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // left-right implementation

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    setdy(parseFloat(steps.current));
  };
  const handleOrientation = (event) => {
    if (!window.firstTime) {
      offset.current = -1 * parseInt(event.alpha);
      window.firstTime = 1;
    }
    dirRef.current = event;
    const calibratedAlpha = event.alpha + offset.current;
    setAlpha(calibratedAlpha);
  };

  const requestPermission = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            window.addEventListener("devicemotion", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("devicemotion", handleMotion);
    }

    props.setCalibrated();
  };

  useEffect(() => {
    if (props.isCalibrated >= 1) requestPermission();
    return () => {
      // Cleanup
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [props.isCalibrated]);

  useEffect(() => {
    if (isWalking) {
      setAlphaSum((prevSum) => prevSum + (360 - alpha));
      setAlphaReadingsCounted((prevCount) => prevCount + 1);
    }
  }, [alpha, isWalking]); // Dependencies ensure this runs whenever alpha or isWalking changes

  const addCheckpoint = () => {
    const avgAlpha = alphaSum / alphaReadingsCounted;
    props.addCheckpoint(dy, avgAlpha);
    setdy(0);
    setAlphaSum(0);
    setAlphaReadingsCounted(1);
  };
  return (
    <>
      {props.isCalibrated < 1 && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style }}>
            <h2 id="parent-modal-title">Please calibrate yourself</h2>
            <p id="parent-modal-description">
              Open your compass app , face towards north and press calibrate
              button .
            </p>
            <Button variant="outlined" onClick={requestPermission}>
              Calibrate
            </Button>
          </Box>
        </Modal>
      )}
      <div className="alpha-angle-container">
        <span className="alpha-angle">{parseInt(alpha).toFixed(2)}</span>
      </div>
      <br></br>
      <div className="alpha-angle-container">
        <span className="alpha-angle">{dy} </span>
      </div>

      <div className="compass-container">
        <Button variant="outlined" onClick={handleWalkingToggle}>
          Stop walking
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            addCheckpoint();
            console.log("okay adding checkpoint");
          }}
        >
          Add checkpoint
        </Button>
      </div>
    </>
  );
}

export default Compass;
