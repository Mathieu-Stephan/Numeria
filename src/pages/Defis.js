import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/Defis.css';
import axios from 'axios';

const Defis = () => {
  const [defis, setDefis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pseudo = localStorage.getItem('pseudo'); // Récupérer le pseudo du user connecté

  useEffect(() => {
    const fetchDefis = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/defis');
        const defisWithStars = await Promise.all(
          response.data.map(async (defi) => {
            try {
              const starsResponse = await axios.get(`http://localhost:3001/api/defiUsers/stars/${pseudo}/${defi.idDefi}`);
              return {
                ...defi,
                nbEtoiles: starsResponse.data.nbEtoiles  // Récupérer le nombre d'étoiles pour ce défi
              };
            } catch (error) {
              console.error(`Erreur lors de la récupération des étoiles pour le défi ${defi.idDefi}:`, error);
              return {
                ...defi,
                nbEtoiles: 0  // Par défaut, aucun étoile si erreur ou si aucune étoile obtenue
              };
            }
          })
        );
        setDefis(defisWithStars);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des défis');
        setLoading(false);
      }
    };

    fetchDefis();
  }, [pseudo]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Liste des Défis</h1>
      </div>
      <div className="defis-container">
        {defis.map((defi) => (
          <Link key={defi.idDefi} to={`/defis/${defi.idDefi}`} className="defi-square">
            <div className="defi-card">
              <h2>{defi.titre}</h2>
              <p>{defi.difficulte}</p>
              <div className="stars-container">
                {[...Array(3)].map((_, index) => (
                  <span key={index} className={`star ${index < defi.nbEtoiles ? 'filled' : ''}`}>&#9733;</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Defis;