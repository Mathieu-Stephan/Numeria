import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Defis = () => {
    const [defis, setDefis] = useState([]);

    useEffect(() => {
        // Données de défis fictives pour les tests
        const defisData = [
            { id: 1, titre: "Défi 1", description: "Description du Défi 1", etoiles: 4 },
            { id: 2, titre: "Défi 2", description: "Description du Défi 2", etoiles: 3 },
            { id: 3, titre: "Défi 3", description: "Description du Défi 3", etoiles: 5 },
            { id: 4, titre: "Défi 4", description: "Description du Défi 4", etoiles: 2 },
            { id: 5, titre: "Défi 5", description: "Description du Défi 5", etoiles: 4 },
            { id: 6, titre: "Défi 6", description: "Description du Défi 6", etoiles: 3 }
        ];

        // Mise à jour de l'état avec les données de défis fictives
        setDefis(defisData);
    }, []);

    return (
        <div className="container">
            <Navbar />
            <div className="content">
                <h1>Liste des Défis</h1>
            </div>
            <div className="defis-container">
                {/* Affichage des défis */}
                {defis.map((defi, index) => (
                    <div key={defi.id} className="defi-square">
                        <div className="defi-card">
                            <h2>{defi.titre}</h2>
                            <p>{defi.description}</p>
                            {/* Affichage du nombre d'étoiles */}
                            <div>
                                {[...Array(defi.etoiles)].map((star, index) => (
                                    <span key={index} className="star">&#9733;</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Defis;
