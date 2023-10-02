// entry point for creator
import { Box, Button } from "@mui/material";
import "./App.css";
import { useState } from "react";
import { CREATOR_SELECTION, ROUTE } from "./utils/constants";
import DirectionContainer from "./component/DirectionContainer";
import MarketSelection from "./component/MarketSelection";
import FormDialog from "./component/FormDialog";

function App() {
  const [creatorSelection, setCreatorSelection] = useState(null);
  const [route, setRoute] = useState(ROUTE.HOMEPAGE);
  const [malls, setMalls] = useState([
    {
      id: 1,
      name: "Ambience Mall, Gurugram",
      imageUrl:
        "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/1/2016/05/Exterior_of_Ambi_Mall.jpg?w=1200&h=628&fill=blur&fit=fill",
    },
    {
      id: 2,
      name: "DLF Promenade, Delhi",
      imageUrl:
        "https://imgmedia.lbb.in/media/2021/03/603c8db2bb3dd9451519351f_1614581170747.jpg",
    }, // ... other malls
  ]);

  const addMalls = (data) => {
    setMalls((prev) => [...prev, data]);
  };

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
            // <Box sx={{ "& button": { m: 1 } }}>
            //   <div>
            //     <Button
            //       variant="outlined"
            //       size="large"
            //       onClick={() => {
            //         setRoute(ROUTE.DIR_CONTAINER);
            //       }}
            //     >
            //       Add Node
            //     </Button>
            //     <Button
            //       variant="outlined"
            //       size="large"
            //       onClick={() => {
            //         setRoute(ROUTE.DIR_CONTAINER);
            //       }}
            //     >
            //       Add connection
            //     </Button>
            //   </div>
            // </Box>
            <>
              <MarketSelection setRoute={setRoute} malls={malls} />
              <FormDialog addMalls={addMalls} />
            </>
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
