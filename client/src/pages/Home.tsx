import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import FeaturedObjects from "../sections/FeaturedObjects";
import MapSection from "../sections/MapSection";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ width: "100%"}}>
      <Header />
      <Hero />
      <FeaturedObjects />
      <MapSection />
      <Footer />
    </Box>

  );
};

export default Home;
