import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import './Defis.css';

const Defis = () => {
    const [defis, setDefis] = useState([]);

    useEffect(() => {
        // Récupérer les défis
        fetch('http://localhost:3001/api/defis')
            .then(response => response.json())
            .then(data => setDefis(data))
            .catch(error => console.error('Erreur lors de la récupération des données des défis', error));
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
                    <div key={defi.id}>
                        <div className="defi-card">
                            <h2>{defi.titre}</h2>
                            <p>{defi.description}</p>
                            {/* Affichage des étoiles */}
                            <div>
                                {[...Array(defi.nbEtoiles)].map((star, index) => (
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
