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
      : [43.7, 18.5];

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col px-4 lg:px-0">
      {title && (
        <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center lg:text-left">
          {title}
        </h2>
      )}

      <div className="w-full h-112.5 lg:h-137.5 rounded-xl overflow-hidden border shadow-sm">
        <MapContainer center={center} zoom={10} className="w-full h-full">
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
                  <div className="w-40 bg-white rounded-lg overflow-hidden flex flex-col">
                    {marker.thumbnailUrl && (
                      <img
                        src={`https://localhost:5001${marker.thumbnailUrl}`}
                        alt={marker.name}
                        className="w-full h-24 object-cover block"
                      />
                    )}

                    <div className="px-2 py-1">
                      <h3 className="text-sm font-semibold leading-tight">
                        {marker.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-tight">
                        {marker.municipality} • {marker.category}
                      </p>
                    </div>

                    <button
                      className="text-xs text-blue-600 px-2 pb-2 text-left hover:underline"
                      onClick={() =>
                        window.location.assign(`/objects/${marker.id}`)
                      }
                    >
                      Pogledaj detalje
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSection;
