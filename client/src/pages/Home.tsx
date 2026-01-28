import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import MapSection, { type MapMarker } from "../sections/MapSection";
import { Box } from "@mui/material";
import { useGetTouristObjectsQuery } from "@/store/api/TouristObjectApi";
import { useAppSelector } from "@/store/store";
import FeaturedObjects from "@/sections/FeaturedObjects";

const Home = () => {
    const objectParams = useAppSelector((state) => state.touristObject);
  
  const { data, isLoading } = useGetTouristObjectsQuery(objectParams);

  if (isLoading || !data) {
    return <div className="text-center py-20">Učitavanje...</div>;
  }

  const { objects } = data;

  const markers: MapMarker[] =
    objects
      ?.filter((o) => o.coordinate1 !== 0 && o.coordinate2 !== 0)
      .map((o) => ({
        id: o.id,
        name: o.name,
        position: [o.coordinate1, o.coordinate2] as [number, number],
      })) ?? [];

  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <Hero />

      <FeaturedObjects />

      {/* 🗺️ MAPA – SVI OBJEKTI */}
      <MapSection title="Mapa turističkih objekata" markers={markers} />

      <Footer />
    </Box>
  );
};

export default Home;
