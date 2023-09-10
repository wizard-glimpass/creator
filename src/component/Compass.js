// src/Compass.js

import React, { useState, useEffect, useRef } from "react";
import "./Compass.css";
import { Box, Button, Modal } from "@mui/material";
import { inertialFrame } from "./helper";
import { ROUTE } from "../utils/constants";

window.previousY = 0;
const useLowPassFilter = (alpha) => {
  const applyFilter = (input) => {
    const output = alpha * input + (1 - alpha) * window.previousY;
    //window.alert(window.previousY);
    window.previousY = output;
    return output;
  };
  return applyFilter;
};

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

  const isCalibrated = window.isCalibrated;
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  ///////////////////////

  const initialState = {
    lastAccelZValue: -9999,
    lastCheckTime: 0,
    highLineState: true,
    lowLineState: true,
    passageState: false,
    highLine: 1,
    highBoundaryLine: 0,
    highBoundaryLineAlpha: 1.0,
    highLineMin: 0.5,
    highLineMax: 1.5,
    highLineAlpha: 0.0005,
    lowLine: -1,
    lowBoundaryLine: 0,
    lowBoundaryLineAlpha: -1.0,
    lowLineMax: -0.5,
    lowLineMin: -1.5,
    lowLineAlpha: 0.0005,
    lowPassFilterAlpha: 0.9,
    step: 0,
  };
  const [directionData, setDirectionData] = useState({});
  const [accelerationData, setAccelerationData] = useState({});
  // const [accXY, setAccXY] = useState({});
  // const [distance, setDistance] = useState(0);
  // const [speed, setSpeed] = useState(0);
  const [final_speed, setFinalSpeed] = useState(0);
  const [dist, setDist] = useState(0);

  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [dx, setdx] = useState(0);
  const [dy, setdy] = useState(0);

  //Low-Pass
  const lowPassALpha = 1 / (1 + (1 / (2 * Math.PI * 6)) * 60);
  const filter = useLowPassFilter(lowPassALpha);

  //datapoint setter
  const [samplePoint, setDatapoint] = useState(0);
  const [deg, setDegree] = useState("Degree");

  const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const accRef = useRef();
  const totalAccX = useRef(0);
  const totalAccY = useRef(0);
  const overTime = useRef(0);
  const timeRef = useRef(new Date());
  const distRef = useRef(0);

  //for datapoint
  var datapoint = 0;
  var degree = "Degree";
  //changes for speed
  const initial_a = useRef(0);
  const intial_speed = useRef(0);
  const final_s = useRef(0);
  const d = useRef(0);
  const prev_force = useRef(0);
  const final_force = useRef(0);
  const final_z = useRef(0);
  const filterdataX_prev = useRef(0);
  const prev_time = useRef(Date.now());
  const prev_time_y = useRef(Date.now());
  const sp_x = useRef(0);
  const sp_y = useRef(0);
  const dist_x = useRef(0);
  const dist_y = useRef(0);
  const final = useRef(0);
  const push = useRef(0);
  const sp_z = useRef(0);
  const steps = useRef(0);
  const push_y = useRef(0);
  const travel = useRef(0);
  const travel_state = useRef(0);
  const temp_angle = useRef(0);
  const prev_angle = useRef(0);
  const omega_a = useRef(0);
  const omega_a_p = useRef(0);
  const omega_max_p = useRef(0);
  const omega_max = useRef(0);
  const left = useRef(0);
  const right = useRef(0);
  //////////////////////
  const [alpha, setAlpha] = useState(0);

  const OFFSET = 0;
  const rotatingPartRef = useRef(null); // Ref for the rotating part of the SVG
  const [isWalking, setIsWalking] = useState(true);
  //const [stepsCounted, setStepsCounted] = useState(0);
  const [alphaSum, setAlphaSum] = useState(0);
  const [alphaReadingsCounted, setAlphaReadingsCounted] = useState(0);

  const [stepCount, setStepCount] = useState(0);
  const accelerometerData = useRef([]);

  function lowPassFilter(data, alpha) {
    let filtered = [];
    filtered[0] = data[0];
    for (let i = 1; i < data.length; i++) {
      filtered[i] = alpha * data[i] + (1 - alpha) * filtered[i - 1];
    }
    return filtered;
  }
  const threshold = 12; // Adjust this value based on testing (Steps)

  useEffect(() => {
    if (isWalking) {
      const processSteps = () => {
        let data = accelerometerData.current;
        data = lowPassFilter(data, 0.9);

        let count = 0;
        for (let i = 1; i < data.length - 1; i++) {
          if (
            data[i] > data[i - 1] &&
            data[i] > data[i + 1] &&
            data[i] > threshold
          ) {
            count++;
          }
        }
        setStepCount((prev) => prev + count);
        accelerometerData.current = []; // Clear the current data
      };
      const interval = setInterval(processSteps, 1000);
      return () => clearInterval(interval);
    }
  }, [isWalking]);

  useEffect(() => {
    setInterval(() => {
      // setDirectionData(dirRef.current);
      setAccelerationData(accRef.current);
      totalAccX.current = totalAccX.current / overTime.current;
      totalAccY.current = totalAccY.current / overTime.current;
      // setAccXY({
      //   x: totalAccX.current,
      //   y: totalAccY.current,
      //   time: overTime.current,
      // });
      overTime.current = 1;
      totalAccX.current = 0;
      totalAccY.current = 0;

      setDatapoint(datapoint);
      datapoint = 0;
    }, 1000);
  }, []);

  const handleWalkingToggle = () => {
    // When stopping walking
    const avgAlpha = alphaSum / alphaReadingsCounted;
    window.alert(
      `Steps Counted: ${dy}\nAverage Alpha(Node is at): ${parseInt(avgAlpha)}`
    );
    setIsWalking(false);
    setStepCount(0);
    setAlphaSum(0);
    setAlphaReadingsCounted(0);
    props.setRoute(ROUTE.NODE_CREATE_FORM);
    props.addTripMetaData({
      angle: parseInt(avgAlpha),
      steps: dy,
      label: "RELATED_TO",
    });
  };
  const handleMotion = (event) => {
    accRef.current = event.acceleration;
    totalAccX.current += parseInt(event.acceleration.x);
    totalAccY.current += parseInt(event.acceleration.y);
    overTime.current++;
    //const currTime = new Date();
    //milliseconds to second
    const timeInterval = 0;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    //setDistance(distRef.current);
    // Do stuff with the new orientation data
    //  dirRef.current.alpha = 360-dirRef.current.alpha
    setDirectionData(dirRef.current);

    //LowPass filteredData
    const filteredDataX = filter(accRef.current.x);
    //const filteredDataY = filter(accRef.current.y);
    //setLowPassY(parseFloat(filteredDataY).toFixed(2));

    const acc_th = 0.1;
    const omega_th = 10;
    const time_th = 0.3;
    const angle_th = 10;
    const force_th = 10;
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
      {
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

    sp_x.current = Math.sqrt(
      prev_force.current * omega_a_p.current * omega_max_p.current
    );
    setFinalSpeed(final_s.current.toFixed(3));
    setX(parseFloat(omega_a_p.current).toFixed(4));
    setY(parseFloat(prev_force.current).toFixed(4));
    setZ(parseFloat(sp_x.current).toFixed(4));
    setdx(parseFloat(omega_max_p.current).toFixed(4));
    setdy(parseFloat(steps.current));
  };
  const handleOrientation = (event) => {
    dirRef.current = event;
    const calibratedAlpha = event.alpha + OFFSET;
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

  console.log(props.isCalibrated);

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
        {/* <span className="alpha-angle">360</span> */}
      </div>
      {/* <div className="step-counter">Steps: {stepCount}</div> */}
      <br></br>
      {/* <Direction /> */}
      <div className="alpha-angle-container">
        <span className="alpha-angle">{dy} </span>
      </div>

      <div className="compass-container">
        <Button variant="outlined" onClick={handleWalkingToggle}>
          Stop walking
        </Button>

        {/* Rest of your Compass UI */}
      </div>
    </>
  );
}

export default Compass;
