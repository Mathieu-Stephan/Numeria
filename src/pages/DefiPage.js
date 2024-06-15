import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import './DefiPage.css';
import axios from 'axios';

const DefiPage = () => {
  const { id } = useParams();
  const [defi, setDefi] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/defis/${id}`)
      .then(response => {
        setDefi(response.data);
      })
      .catch(error => console.error('Error fetching defi:', error));
  }, [id]);

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
        <div className="defi-content">
          <div className="defi-details">
            <div className="info">
              {[...Array(defi.nbEtoiles)].map((_, index) => (
                <span key={index} className="star">&#9733;</span>
              ))}
            </div>
            <p>{defi.description}</p>
            <p> <strong>Contraintes : </strong>{defi.difficulte} - {defi.contrainte}</p>
            
    
            <div className="objectifs">
              <p className="section-title">Objectifs Techniques:</p>
              <ul>
                {[defi.objectifTech1, defi.objectifTech2, defi.objectifTech3, defi.objectifTech4].map((obj, index) => (
                  obj && <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>
            <div className="criteres">
              <p className="section-title">Critères:</p>
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
