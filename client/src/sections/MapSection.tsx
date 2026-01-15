import { Box, Container, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker ikona (radi u Vite + TS + React)
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],       // standardna veličina Leaflet markera
  iconAnchor: [12, 41],     // tačka na kojoj je marker "prikvačen" na mapu
  popupAnchor: [1, -34],    // gdje popup izlazi u odnosu na marker
  shadowSize: [41, 41],
});

// Marker-i (kasnije iz backend-a)
const markers: { id: number; name: string; position: LatLngTuple }[] = [
  { id: 1, name: "Hotel Romanija", position: [43.847, 18.386] },
  { id: 2, name: "Apartmani Jahorina", position: [43.857, 18.394] },
  { id: 3, name: "Pansion Trebević", position: [43.848, 18.378] },
];

const MapSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Mapa objekata
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: { xs: "300px", md: "500px" },
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          mt: 2,
        }}
      >
        <MapContainer
          center={[43.85, 18.39]}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={defaultIcon} // sada ikona radi
            >
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Container>
  );
};

export default MapSection;
