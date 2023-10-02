import React, { useEffect } from "react";

import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { ROUTE } from "../utils/constants";

const MarketSelection = ({ setRoute, malls }) => {
  const handleCardClick = (mallName) => {
    // navigate(`/shops`);
    window.marketSelection = mallName;
    setRoute(ROUTE.DIR_CONTAINER);
  };

  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        Select a Market
      </Typography>

      <Grid container spacing={2}>
        {malls.map((mall) => (
          <Grid item xs={12} sm={6} md={4} key={mall.id}>
            <Card
              onClick={() => handleCardClick(mall.name)}
              elevation={3}
              style={{ transition: "0.3s" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "")}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt={mall.name}
                  height="140"
                  image={mall.imageUrl}
                  style={{ objectFit: "cover" }}
                />

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    align="center"
                  >
                    {mall.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MarketSelection;
