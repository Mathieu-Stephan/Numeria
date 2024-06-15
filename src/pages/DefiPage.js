import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import './DefiPage.css';
import axios from 'axios';

const DefiPage = () => {
  const { id } = useParams();
  const [defi, setDefi] = useState(null);
  const [userStars, setUserStars] = useState(0);  // State to hold user's stars for the defi
  const pseudo = localStorage.getItem('pseudo'); // Get the pseudo of the logged-in user

  useEffect(() => {
    // Fetch defi data
    axios.get(`http://localhost:3001/api/defis/${id}`)
      .then(response => {
        setDefi(response.data);
      })
      .catch(error => console.error('Error fetching defi:', error));

    // Fetch user stars for this defi
    if (pseudo) {
      axios.get(`http://localhost:3001/api/defiUsers/stars/${pseudo}/${id}`)
        .then(response => {
          setUserStars(response.data.nbEtoiles);
        })
        .catch(error => console.error('Error fetching user stars:', error));
    }
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
              {/* Render stars based on userStars */}
              {[...Array(3)].map((_, index) => (
                <span key={index} className={`star ${index < userStars ? 'filled' : ''}`}>&#9733;</span>
              ))}
            </div>
            <p>{defi.description}</p>
            
            <p className="section-title">Objectifs Techniques:</p>
            <div className="objectifs">
              <ul>
                {[defi.objectifTech1, defi.objectifTech2, defi.objectifTech3, defi.objectifTech4].map((obj, index) => (
                  obj && <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            <p className="section-title">Critères:</p>
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
