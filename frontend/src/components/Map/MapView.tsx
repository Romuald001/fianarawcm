import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Toilet } from "../../types/toilet";
import ToiletForm from "../ToiletForm/ToiletForm";
import "leaflet/dist/leaflet.css";
import "./MapView.scss";
import "./FloatingSidebar.scss";
import icon from "../../assets/icons/T.png";

// ✅ Icône personnalisée pour les marqueurs
const toiletIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [30, 30],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// ✅ Liste des quartiers de Fianarantsoa (avec coordonnées approximatives)
const quartiers: Record<string, [number, number]> = {
  "ambalapaiso": [-21.4542, 47.0845],
  "andreba": [-21.4559, 47.0882],
  "andrainjato": [-21.4550, 47.0700],
  "tambohobe": [-21.4478, 47.0865],
  "ambalakely": [-21.4605, 47.0868],
  "isaha": [-21.4600, 47.0900],
  "ampasambazaha": [-21.4640, 47.0750],
  "mahamanina": [-21.4525, 47.0800],
  "ankofafa": [-21.4589, 47.0930],
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

  // ✅ Gestion du clic sur la carte
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedPos(e.latlng);
      },
    });
    return null;
  };

  // ✅ Hook pour obtenir la référence de la carte Leaflet
  const SetMapRef = () => {
    const map = useMap();
    if (!mapRef.current) mapRef.current = map;
    return null;
  };

  // ✅ Fonction pour animer le zoom progressif
  const smoothZoomTo = (lat: number, lng: number, targetZoom = 16) => {
    const map = mapRef.current;
    if (!map) return;

    const currentZoom = map.getZoom();
    const steps = 10;
    const zoomStep = (targetZoom - currentZoom) / steps;
    const latlng = L.latLng(lat, lng);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps) {
        clearInterval(interval);
        return;
      }
      map.setView(latlng, currentZoom + zoomStep * i, { animate: true });
      i++;
    }, 10); // vitesse du zoom progressif (plus petit = plus rapide)
  };

  // ✅ Gérer la saisie dans le champ de recherche
  const handleSearch = (term: string) => {
    const value = term.trim().toLowerCase();
    setSearchTerm(term);

    if (value.length > 0) {
      const filtered = Object.keys(quartiers).filter((q) => q.includes(value));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // ✅ Quand l'utilisateur clique sur une suggestion
  const handleSelectSuggestion = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);

    const coords = quartiers[name.toLowerCase()];
    if (coords) {
      smoothZoomTo(coords[0], coords[1], 16);
    }
  };

  // ✅ Quand il clique sur "Explorer"
  const handleExplore = () => {
    const coords = quartiers[searchTerm.toLowerCase()];
    if (coords) {
      smoothZoomTo(coords[0], coords[1], 16);
      setSuggestions([]);
    } else {
      alert("Quartier introuvable dans la province de Fianarantsoa !");
    }
  };

    // ✅ Fonction pour géolocaliser l'utilisateur et centrer la carte
    const locateUser = () => {
      if (!navigator.geolocation) {
        alert("La géolocalisation n’est pas supportée par ce navigateur.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPos({ lat: latitude, lng: longitude });

          // centrer la carte sur la position de l'utilisateur
          mapRef.current?.flyTo([latitude, longitude], 16, { duration: 2 });
        },
        (err) => {
          console.warn("Erreur de géolocalisation :", err.message);
          alert("Impossible de détecter votre position. Vérifiez vos permissions de localisation.");
        },
        {       
          enableHighAccuracy: true, // active le GPS sur mobile
          timeout: 10000, // délai max avant erreur
          maximumAge: 0, // ne pas réutiliser une ancienne position 
        }
      );
    };


  // ✅ Géolocaliser automatiquement au premier chargement
  useEffect(() => {
    locateUser();
  }, []);

  useEffect(() => {
    if (userPos && mapRef.current) {
      mapRef.current.flyTo(userPos, 16, { duration: 2 });
    }
    }, [userPos]);

  return (
    <MapContainer center={[-21.4527, 47.0857]} zoom={14} className="leaflet-container">
      <SetMapRef />
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />

            {/* ✅ Marqueur de position utilisateur */}
      {userPos && (
        <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
          <Popup>📍 Vous êtes ici</Popup>
        </Marker>
      )}

      {/* ✅ Marqueurs des toilettes approuvées */}
      {toilets
        .filter((t) => t.status === "approved")
        .map((t) => (
          <Marker
            key={t.id}
            position={[parseFloat(t.lat as any), parseFloat(t.lng as any)]}
            icon={toiletIcon}
          >
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

      {/* ✅ Barre latérale flottante */}
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

          {/* ✅ Liste de suggestions */}
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

                {/* ✅ Bouton Localiser */}
        <button className="sidebar-btn locate-btn" onClick={locateUser}>
          📍 Localiser
        </button>
      </div>

      {/* ✅ Formulaire d’ajout */}
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
