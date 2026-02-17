import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import MapSection, { type MapMarker } from "../sections/MapSection";
import { Box } from "@mui/material";
import { useFetchFeaturedObjectsQuery } from "@/store/api/TouristObjectApi";
import FeaturedObjects from "@/sections/FeaturedObjects";
import LoadingSpinner from "@/components/ui/loading";

const Home = () => {

  const { data, isLoading } = useFetchFeaturedObjectsQuery();

  if (isLoading || !data) {
    return <LoadingSpinner />
  }

  const markers: MapMarker[] =
  data
    ?.filter((o) => o.coordinate1 !== 0 && o.coordinate2 !== 0)
    .map((o) => ({
      id: o.id,
      name: o.name,
      position: [o.coordinate1, o.coordinate2] as [number, number],
      thumbnailUrl: o.photographs?.[0]?.url, 
      municipality: o.municipalityName,
      category: o.categoryName,
    })) ?? [];

  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <Hero />

      <FeaturedObjects />


      <MapSection markers={markers} />

      <Footer />
    </Box>
  );
};

export default Home;
