import { Box, Container, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

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

export interface MapMarker {
  id: number;
  name: string;
  position: [number, number];
  thumbnailUrl?: string;  
  municipality?: string;
  category?: string;
}

interface MapSectionProps {
  markers: MapMarker[];
  selectedId?: number;
  title?: string;
}

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
                  <div className="w-40  bg-white rounded-lg overflow-hidden flex flex-col">
                    {marker.thumbnailUrl && (
                      <img
                        src={`https://localhost:5001${marker.thumbnailUrl}`}
                        alt={marker.name}
                        className="w-full h-25 object-cover block"
                      />
                    )}
                    <div className="p-0 mt-2">
                      <h3 className="text-sm font-semibold m-0 leading-none">
                        {marker.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0 leading-none">
                        {marker.municipality} • {marker.category}
                      </p>
                    </div>

                    <button
                      className="text-xs text-blue-600 p-0 m-0 leading-none text-center"
                      onClick={() => window.location.assign(`/objects/${marker.id}`)}
                    >
                      Pogledaj detalje
                    </button>
                  </div>
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
