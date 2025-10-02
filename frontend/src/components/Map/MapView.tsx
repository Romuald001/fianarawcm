import React, { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import ToiletForm from "../ToiletForm/ToiletForm";
import type { Toilet } from "../../types/toilet";

import "leaflet/dist/leftlet.css";

// Correction icone Leaflet par defaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: 
    ("leaflet/dist/images/marker-shadow.png"),
});


interface MapViewProps {
    toilets: Toilet[];
    onNewToilet?: (t: Toilet) => void;
};

const MapView: React.FC<MapViewProps> = ({ toilets, onNewToilet }) => {
    const [clickedPos, setClickedPos] = useState<{ lat: number; lng: number } | null>(null);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setClickedPos(e.latlng);
            },
        });
        return null;
    };

    return (
        <MapContainer>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <MapClickHandler/>

            {clickedPos && (
                <Marker position={clickedPos}>
                    <Popup>
                        <ToiletForm 
                        lat={clickedPos.lat}
                        lng={clickedPos.lng}
                        onSuccess={(t) => {
                            if (onNewToilet) onNewToilet(t);
                            setClickedPos(null);
                        }}
                        onClose={() => setClickedPos(null)}
                        />
                    </Popup>
                </Marker>
            )}

            {toilets.map((t) => (
                <Marker key={t.id} position={{ lat: t.lat, lng: t.lng }}>
                <Popup>
                    <strong>{t.name}</strong>
                    <p>{t.description}</p>
                    <p>Propreté : {t.cleanliness}</p>
                    <p>{t.isFree ? "Gratuit" : "Payant"}</p>
                </Popup>
            </Marker>
        ))}
            

        </MapContainer>
    );
};

export default MapView;