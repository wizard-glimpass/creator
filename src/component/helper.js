export const readStepDetection = (state, accelLinearData) => {
  let {
    lastAccelZValue,
    lastCheckTime,
    highLineState,
    lowLineState,
    passageState,
    highLine,
    highBoundaryLine,
    highLineMin,
    highLineMax,
    highLineAlpha,
    lowLine,
    lowBoundaryLine,
    lowLineMax,
    lowLineMin,
    lowLineAlpha,
    lowPassFilterAlpha,
    highBoundaryLineAlpha,
    lowBoundaryLineAlpha,
    step,
  } = state;

  const currentTime = Date.now();
  const gapTime1 = currentTime - lastCheckTime;

  if (lastAccelZValue === -9999) {
    lastAccelZValue = accelLinearData;
  }

  if (highLineState && highLine > highLineMin) {
    highLine -= highLineAlpha;
    highBoundaryLine = highLine * highBoundaryLineAlpha;
  }

  if (lowLineState && lowLine < lowLineMax) {
    lowLine += lowLineAlpha;
    lowBoundaryLine = lowLine * lowBoundaryLineAlpha;
  }

  const zValue =
    lowPassFilterAlpha * lastAccelZValue +
    (1 - lowPassFilterAlpha) * accelLinearData;
  if (highLineState && gapTime1 > 100 && zValue > highBoundaryLine) {
    highLineState = false;
  }

  if (lowLineState && zValue < lowBoundaryLine && passageState) {
    lowLineState = false;
  }

  if (!highLineState) {
    if (zValue > highLine) {
      highLine = zValue;
      highBoundaryLine = highLine * highBoundaryLineAlpha;
      if (highLine > highLineMax) {
        highLine = highLineMax;
        highBoundaryLine = highLine * highBoundaryLineAlpha;
      }
    } else {
      if (highBoundaryLine > zValue) {
        highLineState = true;
        passageState = true;
      }
    }
  }

  if (!lowLineState && passageState) {
    if (zValue < lowLine) {
      lowLine = zValue;
      lowBoundaryLine = lowLine * lowBoundaryLineAlpha;
      if (lowLine < lowLineMin) {
        lowLine = lowLineMin;
        lowBoundaryLine = lowLine * lowBoundaryLineAlpha;
      }
    } else {
      if (lowBoundaryLine < zValue) {
        lowLineState = true;
        passageState = false;
        step++;
        lastCheckTime = currentTime;
      }
    }
  }

  lastAccelZValue = zValue;

  return {
    lastAccelZValue,
    lastCheckTime,
    highLineState,
    lowLineState,
    passageState,
    highLine,
    highBoundaryLine,
    lowLine,
    lowBoundaryLine,
    step,
  };
};

const yawMatrix = (psi) => {
  return [
    [Math.cos(psi), -Math.sin(psi), 0],
    [Math.sin(psi), Math.cos(psi), 0],
    [0, 0, 1],
  ];
};

const pitchMatrix = (theta) => {
  return [
    [Math.cos(theta), 0, Math.sin(theta)],

    [0, 1, 0],
    [-Math.sin(theta), 0, Math.cos(theta)],
  ];
};

const rollMatrix = (phi) => {
  return [
    [1, 0, 0],
    [0, Math.cos(phi), -Math.sin(phi)],
    [0, Math.sin(phi), Math.cos(phi)],
  ];
};

const vect = (x, y, z) => [x, y, z];

const dotProduct = (A, B) => {
  let result = Array(B.length).fill(0); //.map(() => Array(B.length).fill(0));

  for (let i = 0; i < A.length; i++) {
    //for(let j = 0; j < B[0].length; j++) {
    for (let k = 0; k < A[0].length; k++) {
      // result[i][j] += A[i][k] * B[k][j];
      result[i] += A[i][k] * B[k];
    }
    //}
  }
  return result;
};

const inertialFrame = (alpha, beta, gama, x, y, z) => {
  const X = rollMatrix(-beta);
  const Y = pitchMatrix(-gama);
  const Z = yawMatrix(-alpha);
  const vec = vect(x, y, z);
  return dotProduct(Z, dotProduct(X, dotProduct(Y, vec)));
};

export { yawMatrix, pitchMatrix, rollMatrix, vect, dotProduct, inertialFrame };

////////////////////////////////////////////////////////////////////////////////////

// test 1 , a more robust step algo.
// a peak is where the diffrential of the data abruptly changes direction
// so, can a - accn changing into + always signify a step?
// not always, but all steps must follow this change
// the now to to detect fake step, using step length and step time. Here we will use accn x and y and time

// const push = (a, prev_a, th,) => {
//     if a > th:
//         if prev_a < 0 :
//             if a > 0 :
//                 return True
//     return False
// }
