import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import MapSection from "../sections/MapSection";
import { Box } from "@mui/material";
import AllObjects from "@/sections/AllObjects";
import { useGetTouristObjectsQuery } from "@/store/api/TouristObjectApi";

const Home = () => {
  const { data: objects } = useGetTouristObjectsQuery();

  const markers =
    objects?.map((o) => ({
      id: o.id,
      name: o.name,
      position: [o.coordinate1, o.coordinate2] as [number, number],
    })) ?? [];

  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <Hero />
      <AllObjects />

      {/* 🗺️ MAPA – SVI OBJEKTI */}
      <MapSection
        title="Mapa turističkih objekata"
        markers={markers}
      />

      <Footer />
    </Box>
  );
};

export default Home;
