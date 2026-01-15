import { Box, Typography } from "@mui/material";

const HeroObjekti = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "200px", md: "300px" },
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        mb: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.5)", // presvucena boja preko slike
          zIndex: 1,
        },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Svi objekti
      </Typography>
    </Box>
  );
};

export default HeroObjekti;
