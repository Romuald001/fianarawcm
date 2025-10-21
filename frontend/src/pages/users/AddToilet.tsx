import ToiletForm from "../../components/ToiletForm/ToiletForm";
import "./AddToilet.scss";

const AddToilet = () => {
    return (
        <div className="add-toilet-page">
            <div className="hero">
                <h1>Ajouter une toilette 🚻</h1>
                <p>Partagez les toilettes publiques de votre ville pour aider la communauté.</p>
            </div>
            <ToiletForm lat={-21.4527} lng={47.0857} />
            <div className="tip">
                💡 Astuce : Cliquez sur la carte pour remplir automatiquement les coordonnées.
            </div>
        </div>
    );
};

export default AddToilet;