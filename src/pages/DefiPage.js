import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/DefiPage.css';
import axios from 'axios';

const DefiPage = () => {
  const { id } = useParams();
  const [defi, setDefi] = useState(null);
  const [userStars, setUserStars] = useState(0);
  const [userTime, setUserTime] = useState(0);
  const pseudo = localStorage.getItem('pseudo');
  const hasDefi = localStorage.getItem('defi');

  const history = useHistory();

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
  }, [id, pseudo, hasDefi]);

  // Fonction à exécuter lorsque l'utilisateur clique sur "Commencer le défi"
  const handleStartDefi = async () => {

    localStorage.setItem("defi", id);
    window.location.replace(`http://localhost:301${id}/defi/${id}/${pseudo}`);
    
  };

  const handleStopDefi = async () => {

    localStorage.removeItem("defi");
    window.location.replace(`http://localhost:3000/defis/${id}`);
    
  };

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
              {[...Array(3)].map((_, index) => (
                <span key={index} className={`star ${index < userStars ? 'filled' : ''}`}>&#9733;</span>
              ))}
            </div>
            <p><strong>Temps passé sur ce défi : {userTime} minutes</strong></p>
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
            {pseudo && (
              !hasDefi ? (
                <button className="start-button" onClick={handleStartDefi}>Commencer le défi</button>
              ) : (
                <button className="stop-button" onClick={handleStopDefi}>Arrêter le défi</button>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefiPage;
