import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import '../styles/Classement.css';

const Classement = () => {
  const [currentChallenge, setCurrentChallenge] = useState('General');
  const [ranking, setRanking] = useState([]);
  const [defis, setDefis] = useState([]);

  useEffect(() => {
    // Récupérer les défis
    fetch('http://localhost:3001/api/defis')
      .then(response => response.json())
      .then(data => setDefis(data))
      .catch(error => console.error('Erreur lors de la récupération des données des défis', error));
  }, []);

  useEffect(() => {
    // Récupérer le classement en fonction du défi sélectionné
    const fetchRanking = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/classement/${currentChallenge}`);
        const data = await response.json();
        setRanking(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du ranking', error);
      }
    };

    fetchRanking();
  }, [currentChallenge]);

  const handleSelectChange = (e) => {
    setCurrentChallenge(e.target.value);
  };

  const renderRanking = () => {
    return (
      <ul>
        {ranking.map((user, index) => (
          <li key={index}>
            {index + 1}. {user.unUser} - {user.nufs} nufs - {user.temps} minutes
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Classement</h1>
        <div className="select-container">
          <select onChange={handleSelectChange} value={currentChallenge}>
            <option value="General">Général</option>
            {defis.map((defi, index) => (
              <option key={index} value={defi.titre}>
                {defi.titre}
              </option>
            ))}
          </select>
        </div>
        <div className="ranking-container">
          {renderRanking()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Classement;
