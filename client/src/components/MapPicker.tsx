import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ispravno tipovanje za TypeScript
const iconDefault = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: () => string;
};
delete iconDefault._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

export default function MapPicker({ lat, lng, onChange }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={10}
      className="h-75 rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={[lat, lng]}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            if (marker instanceof L.Marker) {
              const pos = marker.getLatLng();
              onChange(pos.lat, pos.lng);
            }
          },
        }}
      />
    </MapContainer>
  );
}
