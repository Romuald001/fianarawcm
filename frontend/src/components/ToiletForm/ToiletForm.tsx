import React, { useState} from "react";
import type { Toilet } from "../../types/toilet";
import { toilet } from "../../services/toilet.api";
import { savePendingToilet } from "../../utils/offline";

// Props: coordonnées initiales pour le marker ou click sur carte
interface ToiletFormProps {
    lat: number;
    lng: number;
    onSuccess?: (newToilet: Toilet) => void; // callback apres creation
    onClose?: () => void;   // void fermer popup si utilise dans map
};

const ToiletForm: React.FC<ToiletFormProps> = ({ lat, lng, onSuccess, onClose }) => {
    // Etats du formulaire
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<String>("");
    const [isFree, setIsFree] = useState<boolean>(true);
    const [isAccessible, setIsAccessible] = useState<boolean>(false);
    const [cleanliness, setCleanliness] = useState<"good" | "average" | "bad">("good");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        const payload: Partial<Toilet> = {
            name,
            description,
            lat,
            lng,
            isFree,
            isAccessible,
            cleanliness,
        };

        try {
            if (!navigator.onLine) {
                // Sauvegarde offline si pas connecté
                await savePendingToilet(payload);
                alert("Enregistré en local. Synchronisation dès que vous êtes en ligne.");
            } else {
                const created = await toilet.createToilet(payload);
                alert("Toilette créée !");
                if (onSuccess) onSuccess(created);
            }
            // Reset du formulaire
            setName("");
            setDescription("");
            setIsFree(true);
            setIsAccessible(false);
            setCleanliness("good");
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data.message || "Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="toilet-form" onSubmit={handleSubmit}>
            <h3>Ajouter une toilette</h3>
            <div className="error"></div>
            <label htmlFor="">
                Nom
                <input type="text" />
            </label>

            <label htmlFor="">
                Description
                <textarea name="" id=""></textarea>
            </label>

            <label htmlFor="">
                Gratuit ?
                <input type="text" />
            </label>

            <label htmlFor="">
                Accessible PMR ?
                <input type="text" />
            </label>

            <label htmlFor="">
                Propreté
            </label>


            <button>
                Ajouter
            </button>
        </form>
    );
};

export default ToiletForm;