import { Box } from "@mui/material";
import Header from "../components/Header";
import ObjectsHero from "../sections/ObjectsHero";
import AllObjects from "../sections/AllObjects";
import MapSection from "../sections/MapSection";
import Footer from "../components/Footer";

const Objects = () => {
  return (
    <Box sx={{ width: "100%"}}>
      <Header />
      <ObjectsHero />
      <AllObjects />
      <MapSection />
      <Footer />
    </Box>

  );
};

export default Objects;