// src/sections/Hero.tsx
import { Container, Typography, Button, Box } from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import grad1 from "../assets/grad1.jpg";
import grad2 from "../assets/grad2.jpg";
import grad3 from "../assets/grad3.jpg";

import { useEffect, useState } from "react";

const images = [grad1, grad2, grad3];

const HeroImageSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 250, md: 400 },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {images.map((img, i) => (
        <Box
          key={i}
          component="img"
          src={img}
          alt="Grad"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </Box>
  );
};

const Hero = () => {
  return (
    // FULL WIDTH HERO
    <Box
      sx={{
        width: "100%",
        py: { xs: 6, md: 10 },
        bgcolor: "#f4f6f8", // globalna siva pozadina
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Lijeva strana: tekst */}
          <Grid xs={12} md={6}>
            <Box
              sx={{
                pr: { md: 4 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  opacity: 0,
                  animation: "fadeInUp 1s forwards",
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                Otkrijte turističke objekte Istočnog Sarajeva
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{
                  mb: 3,
                  color: "gray",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  opacity: 0,
                  animation: "fadeInUp 1.2s forwards",
                }}
              >
                Centralna evidencija i promocija hotela, apartmana i drugih
                smještajnih kapaciteta.
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  background: "linear-gradient(90deg, #646cff 0%, #535bf2 100%)",
                  opacity: 0,
                  animation: "fadeInUp 1.4s forwards",
                }}
              >
                Pogledaj objekte
              </Button>
            </Box>
          </Grid>

          {/* Desna strana: slideshow */}
          <Grid xs={12} md={6}>
            <HeroImageSlider />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
