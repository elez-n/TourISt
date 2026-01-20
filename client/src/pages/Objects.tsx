import { Box } from "@mui/material";
import { useState } from "react";

import Header from "../components/Header";
import ObjectsHero from "../sections/ObjectsHero";
import AllObjects from "../sections/AllObjects";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import SearchBar from "@/sections/SearchBar";

import { useGetTouristObjectsQuery } from "@/store/api/TouristObjectApi";

const Objects = () => {
  const [search, setSearch] = useState("");

  const { data: objects, isLoading } = useGetTouristObjectsQuery();

  // ⛔ dok se ne učita
  if (isLoading || !objects) return null;

  // ✅ PRAVI MARKERI IZ BACKENDA
  const markers: MapMarker[] = objects
    .filter(
      (o) =>
        o.coordinate1 !== 0 &&
        o.coordinate2 !== 0
    )
    .map((o) => ({
      id: o.id,
      name: o.name,
      position: [o.coordinate1, o.coordinate2],
    }));

  return (
    <Box sx={{ width: "100%" }}>
      <Header />

      <ObjectsHero />

      <SearchBar
        value={search}
        onSearch={setSearch}
      />

      <AllObjects />

      <MapSection
        title="Mapa svih objekata"
        markers={markers}
      />

      <Footer />
    </Box>
  );
};

export default Objects;
