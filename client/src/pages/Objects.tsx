import { Box } from "@mui/material";
import Header from "../components/Header";
import ObjectsHero from "../sections/ObjectsHero";
import AllObjects from "../sections/AllObjects";
import MapSection from "../sections/MapSection";
import Footer from "../components/Footer";
import SearchBar from "@/sections/SearchBar";
import { useState } from "react";

const Objects = () => {
  const [search, setSearch] = useState("");

  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <ObjectsHero />
      <SearchBar
        value={search}
        onSearch={setSearch}
      />
      <AllObjects />
      <MapSection />
      <Footer />
    </Box>

  );
};

export default Objects;