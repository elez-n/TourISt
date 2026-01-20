import { Box, Container, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

// Ikone
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// ===== IKONE =====
const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const highlightedIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ===== TIP =====
export interface MapMarker {
  id: number;
  name: string;
  position: LatLngTuple;
}

// ===== PROPS =====
interface MapSectionProps {
  markers: MapMarker[];
  selectedId?: number;
  title?: string;
}

// ===== KOMPONENTA =====
const MapSection = ({ markers, selectedId, title }: MapSectionProps) => {
  const center: LatLngTuple =
    selectedId && markers.find((m) => m.id === selectedId)
      ? markers.find((m) => m.id === selectedId)!.position
      : [43.85, 18.39];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {title && (
        <Typography variant="h5" textAlign="center" gutterBottom>
          {title}
        </Typography>
      )}

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
          center={center}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {markers.map((marker) => {
            const isSelected = marker.id === selectedId;

            return (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={isSelected ? highlightedIcon : defaultIcon}
              >
                <Popup>
                  <strong>{marker.name}</strong>
                  {isSelected && <div>(trenutni objekat)</div>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Box>
    </Container>
  );
};

export default MapSection;
