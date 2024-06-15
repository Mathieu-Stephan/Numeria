// DefiPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import './DefiPage.css';
import axios from 'axios';

const DefiPage = () => {
  const { id } = useParams();
  const [defi, setDefi] = useState(null);
  const [userStars, setUserStars] = useState(0); // State pour les étoiles de l'utilisateur
  const [userTime, setUserTime] = useState(0); // State pour le temps passé sur le défi par l'utilisateur
  const pseudo = localStorage.getItem('pseudo'); // Récupérer le pseudo de l'utilisateur connecté

  useEffect(() => {
    // Fonction pour récupérer les détails du défi
    const fetchDefi = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/defis/${id}`);
        setDefi(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du défi :', error);
      }
    };

    // Fonction pour récupérer les étoiles de l'utilisateur pour ce défi
    const fetchUserStars = async () => {
      try {
        const starsResponse = await axios.get(`http://localhost:3001/api/defiUsers/stars/${pseudo}/${id}`);
        setUserStars(starsResponse.data.nbEtoiles);
      } catch (error) {
        console.error('Erreur lors de la récupération des étoiles de l\'utilisateur :', error);
      }
    };

    // Fonction pour récupérer le temps passé par l'utilisateur sur ce défi
    const fetchUserTime = async () => {
      try {
        const timeResponse = await axios.get(`http://localhost:3001/api/defiUsers/time/${pseudo}/${id}`);
        setUserTime(timeResponse.data.temps);
      } catch (error) {
        console.error('Erreur lors de la récupération du temps de l\'utilisateur :', error);
      }
    };

    // Appels des fonctions de récupération des données
    fetchDefi();
    fetchUserStars();
    fetchUserTime();
  }, [id, pseudo]);

  if (!defi) {
    return (
      <div className="container">
        <Navbar />
        <div className="content defi-page">
          <h1>Chargement...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <div className="content defi-page">
        <h1>{defi.titre}</h1>
        <p><i>{defi.difficulte} - {defi.contrainte}</i></p>
        <div className="defi-content">
          <div className="defi-details">
            <div className="info">
              {/* Affichage des étoiles en fonction du nombre d'étoiles de l'utilisateur */}
              {[...Array(3)].map((_, index) => (
                <span key={index} className={`star ${index < userStars ? 'filled' : ''}`}>&#9733;</span>
              ))}
            </div>
            {/* Affichage du temps passé par l'utilisateur */}
            <p> <strong> Temps passé sur ce défi : {userTime} minutes </strong> </p>

            <p>{defi.description}</p>
            
            <p className="section-title">Objectifs Techniques :</p>
            <div className="objectifs">
              <ul>
                {[defi.objectifTech1, defi.objectifTech2, defi.objectifTech3, defi.objectifTech4].map((obj, index) => (
                  obj && <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            <p className="section-title">Critères :</p>
            <div className="criteres">
              <ul>
                {[defi.critere1, defi.critere2, defi.critere3, defi.critere4].map((crit, index) => (
                  crit && <li key={index}>{crit}</li>
                ))}
              </ul>
            </div>
            <button className="start-button">Commencer le défi</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefiPage;
