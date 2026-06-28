import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import type { Toilet } from "../../types/toilet";
import ToiletForm from "../ToiletForm/ToiletForm";
import { findNearest } from "../../utils/geo";
import { useAuth } from "../../hooks/useAuth";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./MapView.scss";
import "./FloatingSidebar.scss";
import icon from "../../assets/icons/T.png";

// Icône personnalisée pour les toilettes
const toiletIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [30, 30],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// Icône personnalisée pour la position utilisateur
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Coordonnées de quartiers à Fianarantsoa
const quartiers: Record<string, [number, number]> = {
  ambalapaiso: [-21.4542, 47.0845],
  andreba: [-21.4559, 47.0882],
  andrainjato: [-21.455, 47.07],
  tambohobe: [-21.4478, 47.0865],
  ambalakely: [-21.4605, 47.0868],
  isaha: [-21.46, 47.09],
  ampasambazaha: [-21.464, 47.075],
  mahamanina: [-21.4525, 47.08],
  ankofafa: [-21.4589, 47.093],
};

interface MapViewProps {
  toilets: Toilet[];
  onNewToilet: (t: Toilet) => void;
}

const MapView: React.FC<MapViewProps> = ({ toilets, onNewToilet }) => {
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null); // nom correct
  const { token } = useAuth();
  const navigate = useNavigate();

  // Gérer les clics sur la carte
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!token) {
          navigate("/login");
          return;
        }
        setSelectedPos(e.latlng);
      },
    });
    return null;
  };

  const SetMapRef = () => {
    const map = useMap();
    if (!mapRef.current) mapRef.current = map;
    return null;
  };

  // Zoom progressif
  const smoothZoomTo = (lat: number, lng: number, targetZoom = 16) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([lat, lng], targetZoom, { duration: 2 });
  };

  // Recherche
  const handleSearch = (term: string) => {
    const value = term.trim().toLowerCase();
    setSearchTerm(term);
    setSuggestions(value ? Object.keys(quartiers).filter((q) => q.includes(value)) : []);
  };

  const handleSelectSuggestion = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);
    const coords = quartiers[name.toLowerCase()];
    if (coords) smoothZoomTo(coords[0], coords[1]);
  };

  const handleExplore = () => {
    const coords = quartiers[searchTerm.toLowerCase()];
    if (coords) smoothZoomTo(coords[0], coords[1]);
    else alert("Quartier introuvable dans la province de Fianarantsoa !");
  };

  // Localiser l'utilisateur
  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas supportée par ce navigateur.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        mapRef.current?.flyTo([latitude, longitude], 16, { duration: 2 });
      },
      (err) => {
        console.warn("Erreur de géolocalisation :", err.message);
        alert("Impossible de détecter votre position. Vérifiez vos permissions de localisation.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    locateUser();
  }, []);

  // Trouver toilette la plus proche et tracer itinéraire
  const handleFindNearest = async () => {
    if (!userPos) {
      alert("Veuillez activer la géolocalisation d'abord.");
      return;
    }

    const approvedToilets = toilets.filter((t) => t.status === "approved");
    if (approvedToilets.length === 0) {
      alert("Aucune toilette approuvée trouvée !");
      return;
    }

    const [nearest] = findNearest(approvedToilets, userPos.lat, userPos.lng, 1);

    if (nearest) {
      mapRef.current?.flyTo([nearest.lat, nearest.lng], 17, { duration: 2 });
      L.popup()
        .setLatLng([nearest.lat, nearest.lng])
        .setContent(
          `<b>🧭 Toilette la plus proche :</b><br>${nearest.name}<br><i>${nearest.description}</i><br><br>Distance approximative : ${(
            nearest.distance! / 1000
          ).toFixed(2)} km`
        )
        .openOn(mapRef.current!);

      await drawRouteORS(userPos, { lat: nearest.lat, lng: nearest.lng }); // correction du type
    }
  };

  // Tracer itinéraire via OpenRouteService
  const drawRouteORS = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey) {
      alert("Clé API OpenRouteService manquante !");
      return;
    }

    try {
      const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
      const body = {
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erreur API ORS");
      const data = await res.json();

      // Supprimer l'ancien tracé s’il existe
      if (routeLayerRef.current) {
        mapRef.current?.removeLayer(routeLayerRef.current);
      } 

      // Tracer la nouvelle route
      const coords = data.features[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
      const routeLine = L.polyline(coords, { color: "blue", weight: 4 }).addTo(mapRef.current!);
      routeLayerRef.current = routeLine;
      mapRef.current?.fitBounds(routeLine.getBounds());
    } catch (err) {
      console.error(err);
      alert("Impossible de tracer l’itinéraire. Vérifiez votre connexion ou votre clé API.");
    }
  };

  return (
    <MapContainer center={[-21.4527, 47.0857]} zoom={14} className="leaflet-container">
      <SetMapRef />
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />

      {userPos && (
        <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
          <Popup>📍 Vous êtes ici</Popup>
        </Marker>
      )}

      {toilets
        .filter((t) => t.status === "approved")
        .map((t) => (
          <Marker key={t.id} position={[parseFloat(String(t.lat)), parseFloat(String(t.lng))]} icon={toiletIcon}>
            <Popup>
              <h4>{t.name}</h4>
              <p>{t.description}</p>
              <p>{t.isAccessible}</p>
              <p>{t.cleanliness}</p>
              <p>{t.status}</p>
            </Popup>
          </Marker>
        ))}s

      <div
        className="floating-sidebar"
        ref={(el) => {
          if (el) {
            L.DomEvent.disableClickPropagation(el);
            L.DomEvent.disableScrollPropagation(el);
          }
        }}
      >
        <h3>Toilet Finder 🧭</h3>
        <p>Recherchez un quartier à Fianarantsoa pour explorer les toilettes proches.</p>

        <div className="sidebar-search-wrapper">
          <input
            type="text"
            placeholder="Ex: Ambalapaiso..."
            className="sidebar-search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="suggestion-list">
              {suggestions.map((s) => (
                <li key={s} onClick={() => handleSelectSuggestion(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="sidebar-btn" onClick={handleExplore}>
          Explorer
        </button>
        <button className="sidebar-btn locate-btn" onClick={locateUser}>
          📍 Votre position
        </button>
        <button className="sidebar-btn nearest-btn" onClick={handleFindNearest}>
          🚀 Toilette la plus proche
        </button>
      </div>

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
