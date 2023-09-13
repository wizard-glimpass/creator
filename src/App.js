// entry point for creator
import { Box, Button } from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";
import { CREATOR_SELECTION, ROUTE } from "./utils/constants";
import DirectionContainer from "./component/DirectionContainer";

function App() {
  const [creatorSelection, setCreatorSelection] = useState(null);
  const [route, setRoute] = useState(ROUTE.HOMEPAGE);

  useEffect(() => {}, []);
  return (
    <div className="App">
      {route === ROUTE.HOMEPAGE && (
        <>
          <div class="company-title-text">
            <h3>Welcome to GLIMPASS</h3>
          </div>
          {creatorSelection === null && (
            <Box sx={{ "& button": { m: 1 } }}>
              <div>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setCreatorSelection(CREATOR_SELECTION.START_TRIP);
                  }}
                >
                  Start Trip
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setCreatorSelection(CREATOR_SELECTION.MANAGE_HISTORY);
                  }}
                >
                  Manage trip history
                </Button>
              </div>
            </Box>
          )}
          {creatorSelection === CREATOR_SELECTION.START_TRIP && (
            <Box sx={{ "& button": { m: 1 } }}>
              <div>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setRoute(ROUTE.DIR_CONTAINER);
                  }}
                >
                  Add Node
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setRoute(ROUTE.DIR_CONTAINER);
                  }}
                >
                  Add connection
                </Button>
              </div>
            </Box>
          )}
        </>
      )}
      {route === ROUTE.DIR_CONTAINER && (
        <>
          <DirectionContainer />
        </>
      )}
    </div>
  );
}

export default App;
