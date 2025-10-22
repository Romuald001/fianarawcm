import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Toilet } from "../../types/toilet";
import ToiletForm from "../ToiletForm/ToiletForm";
import "leaflet/dist/leaflet.css";
import "./MapView.scss";

// Icône personnalisée pour les marqueurs
const toiletIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

interface MapViewProps {
  toilets: Toilet[];
  onNewToilet: (t: Toilet) => void;
}

const MapView: React.FC<MapViewProps> = ({ toilets, onNewToilet }) => {
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);

  // Gestion des clics sur la carte
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedPos(e.latlng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[-21.4527, 47.0857]} zoom={14} className="leaflet-container">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler />

      {/* Affichage des toilettes existantes */}
     {toilets
        .filter((t) => t.status === "approved")
        .map((t) => (
          <Marker key={t.id} position={[parseFloat(t.lat as any), parseFloat(t.lng as any)]} icon={toiletIcon}>

            <Popup className="toilet-popup">
              <div className="popup-content">
                <h4>{t.name}</h4>
                <p className="desc">{t.description}</p>

                <div className="details">
                  <p><strong>💰 Tarification :</strong> {t.isFree ? "Gratuit" : "Payant"}</p>
                  <p><strong>♿ Accessibilité :</strong> {t.isAccessible ? "Accessible PMR" : "Non accessible"}</p>
                  <p><strong>🧼 Propreté :</strong> 
                    <span className={`clean ${t.cleanliness}`}>{t.cleanliness}</span>
                  </p>
                  <p><strong>✅ Statut :</strong> {t.status}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Si on clique, on affiche le formulaire */}
      {selectedPos && (
        <Popup position={selectedPos}>
          <ToiletForm
            lat={selectedPos.lat}
            lng={selectedPos.lng}
            onSuccess={(newToilet) => {
              onNewToilet(newToilet);
              setSelectedPos(null);
            }}
            onClose={() => setSelectedPos(null)}
          />
        </Popup>
      )}
    </MapContainer>
  );
};

export default MapView;
