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
  const [calcStepsValue, setCalcStepsValue] = useState(0);
  const [isTurning, setTurning] = useState(true);
  const [open, setOpen] = useState(true);
  const [modalState, setmodalState] = useState(false);
  const [confirmAngleAndSteps, setConfirmAngleAndSteps] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  ///////////////////////

  const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const accRef = useRef();
  const distRef = useRef(0);

  //changes for speed

  //changes for speed
  const final_s = useRef(0);
  const prev_force = useRef(0);
  const final_force = useRef(0);
  const prev_time = useRef(Date.now());
  const sp_x = useRef(0);
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
  const lrav_prev = useRef(-1);
  const lrav_now = useRef(0);
  const lrav_push = useRef(0);
  const lrav_final = useRef(0);
  const lrah_final = useRef(0);
  const lrov_final = useRef(0);
  const lroh_prev = useRef(-1);
  const lroh_now = useRef(0);
  const lroh_push = useRef(0);
  const lroh_final = useRef(0);

  //////////////////////
  const [alpha, setAlpha] = useState(0);
  const [originNumber, setOriginNumber] = useState(0);

  const offset = useRef(0);
  const [isWalking, setIsWalking] = useState(true);
  const [alphaSum, setAlphaSum] = useState(0);
  const [alphaReadingsCounted, setAlphaReadingsCounted] = useState(0);

  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [dx, setdx] = useState(0);
  const [dy, setdy] = useState(0);
  const [directionData, setDirectionData] = useState({});
  const [final_speed, setFinalSpeed] = useState(0);

  const sendAngleStepsPayload = () => {
    const avgAlpha = 360 - alphaSum / alphaReadingsCounted;

    props.addTripMetaData({
      angle: parseInt(avgAlpha),
      steps: calcStepsValue,
      label: "RELATED_TO",
    });
    props.setRoute(ROUTE.NODE_CREATE_FORM);
    steps.current = 0;
    setdy(0);
    setAlphaSum(0);
    setAlphaReadingsCounted(1);

    setConfirmAngleAndSteps(false);
  };
  const handleWalkingToggle = () => {
    // When stopping walking
    const avgAlpha = 360 - alphaSum / alphaReadingsCounted;

    setCalcStepsValue(dy);
    setConfirmAngleAndSteps(true);
    setmodalState(true);
    setIsWalking(false);
  };
  const handleMotion = (event) => {
    accRef.current = event.acceleration;

    const timeInterval = 0;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    setDirectionData(dirRef.current);

    const acc_th = 0.1;
    const time_th = 0.4;
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
    const rate_b = parseInt(event.rotationRate.beta);
    let rate_c = parseInt(event.rotationRate.gamma);
    const final_omega = inertialFrame(
      sin_a * (Math.PI / 180),
      sin_b * (Math.PI / 180),
      sin_g * (Math.PI / 180),
      rate_a,
      rate_b,
      rate_c
    );
    rate_c = final_omega[2];

    //windows.alert(sin_b)
    final.current = inertialFrame(
      sin_a * (Math.PI / 180),
      sin_b * (Math.PI / 180),
      sin_g * (Math.PI / 180),
      accn_x,
      accn_y,
      accn_z
    );

    // accn vertical
    if (lrav_prev.current == -1) {
      if (final.current[2] < 0) {
        lrav_push.current -= 1;
      }
      if (lrav_push.current < -10) {
        lrav_now.current = 1;
      }
    } else {
      if (final.current[2] > 0) {
        lrav_push.current += 1;
      }
      if (lrav_push.current > 3) {
        lrav_now.current = -1;
      }
    }
    lrav_final.current = lrav_prev.current * lrav_now.current;

    // omega horizontal
    if (lroh_prev.current == -1) {
      if (rate_c < 0) {
        lroh_push.current -= 1;
      }
      if (lroh_push.current < -10) {
        lroh_now.current = 1;
      }
    } else {
      if (rate_c > 0) {
        lroh_push.current += 1;
      }
      if (lroh_push.current > 10) {
        lroh_now.current = -1;
      }
    }
    lroh_final.current = lroh_prev.current * lroh_now.current;

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
          omega_max.current < 50 &&
          omega_max.current > 5 &&
          (lroh_final.current == -1 || lrav_final.current == -1)
          //||travel_state.current == 0
        ) {
          steps.current += 1;
          push.current = 1;
          prev_time.current = Date.now();
          lroh_prev.current = lroh_now.current;
          lroh_push.current = 0;
          lrav_prev.current = lrav_now.current;
          lrav_push.current = 0;

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
          //   window.angleError = Math.atan(Math.sin(sin_a* (Math.PI / 180))/(window.currentStep-Math.cos(sin_a* (Math.PI / 180))));
          //   window.stepError = Math.sqrt((window.currentStep - Math.cos(sin_a* (Math.PI / 180))) + Math.sin(sin_a* (Math.PI / 180)));
          //   window.stepError = window.currentStep - window.stepError-1;
        }

        if (omega_max.current > 0) {
          omega_max_p.current = omega_max.current;
        }
        omega_max.current = 0;
      }
    }

    if (final.current[2] <= 0) {
      push.current -= 0.51;
      if (push.current < 0) {
        push.current = 0;
        push_y.current = 0;
      }
    }

    sp_x.current = Math.sqrt(
      prev_force.current * omega_a_p.current * omega_max_p.current
    );
    setFinalSpeed(final_s.current.toFixed(3));
    setX(parseFloat(lrah_final.current).toFixed(4));
    setY(parseFloat(lrov_final.current).toFixed(4));
    setZ(parseFloat(lroh_final.current).toFixed(4));
    setdx(parseFloat(sp_x.current).toFixed(4));
    setdy(parseFloat(steps.current));
  };
  const handleOrientation = (event) => {
    if (!window.firstTime) {
      offset.current = -1 * parseInt(event.alpha);
      window.firstTime = 1;
    }
    dirRef.current = event;
    let calibratedAlpha = event.alpha + offset.current;
    if (calibratedAlpha < 0) {
      calibratedAlpha = -1 * calibratedAlpha;
      calibratedAlpha = 360 - calibratedAlpha;
    }
    setAlpha(calibratedAlpha);
    setOriginNumber(event.alpha);
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
    if (props.showComp) {
      setIsWalking(true);
    }
  }, [props.showComp]);

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
      setAlphaSum((prevSum) => prevSum + alpha);
      setAlphaReadingsCounted((prevCount) => prevCount + 1);
    }
  }, [alpha, isWalking]); // Dependencies ensure this runs whenever alpha or isWalking changes

  const addCheckpoint = () => {
    const avgAlpha = 360 - alphaSum / alphaReadingsCounted;
    props.addCheckpoint(dy, avgAlpha);
    steps.current = 0;
    setdy(0);
    setAlphaSum(0);
    setAlphaReadingsCounted(1);
  };

  return (
    <div className={props.showComp ? "show" : "hide"}>
      {confirmAngleAndSteps && props.showComp && (
        <Modal
          open={modalState}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style }}>
            <input
              type="number"
              value={calcStepsValue}
              onChange={(e) => {
                setCalcStepsValue(e.target.value);
              }}
            />
            <Button variant="outlined" onClick={sendAngleStepsPayload}>
              SubmitNodeData
            </Button>
          </Box>
        </Modal>
      )}
      {props.isCalibrated < 1 && props.showComp && (
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
        {isTurning ? (
          <Button
            variant="outlined"
            onClick={() => {
              setIsWalking(false);
              setTurning(false);
              addCheckpoint();
            }}
          >
            Add Checkpoint
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => {
              setIsWalking(true);
              setTurning(true);
              console.log("okay adding checkpoint");
            }}
          >
            start Walking
          </Button>
        )}
      </div>
    </div>
  );
}

export default Compass;
