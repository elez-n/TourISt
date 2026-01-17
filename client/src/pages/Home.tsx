import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import MapSection from "../sections/MapSection";
import { Box } from "@mui/material";
import AllObjects from "@/sections/AllObjects";

const Home = () => {
  return (
    <Box sx={{ width: "100%"}}>
      <Header />
      <Hero />
      <AllObjects />
      <MapSection />
      <Footer />
    </Box>

  );
};

export default Home;
