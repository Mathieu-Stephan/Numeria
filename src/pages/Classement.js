import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Classement = () => {
  const [currentChallenge, setCurrentChallenge] = useState('defi1');
  const [rankings, setRankings] = useState({
    defi1: [],
    defi2: [],
    defi3: [],
  });

  useEffect(() => {
    // Remplacer par les appels API réels pour obtenir les classements des défis
    const fetchRankings = async () => {
      try {
        const response1 = await fetch('http://localhost:3001/api/classement/defi1');
        const defi1Rankings = await response1.json();
        
        const response2 = await fetch('http://localhost:3001/api/classement/defi2');
        const defi2Rankings = await response2.json();
        
        const response3 = await fetch('http://localhost:3001/api/classement/defi3');
        const defi3Rankings = await response3.json();

        setRankings({
          defi1: defi1Rankings,
          defi2: defi2Rankings,
          defi3: defi3Rankings,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des classements:', error);
      }
    };

    fetchRankings();
  }, []);

  const renderRanking = (defi) => {
    return (
      <ul>
        {rankings[defi].map((user, index) => (
          <li key={index}>
            {index + 1}. {user.name} - {user.score} points
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
        <div className="button-container">
          <button onClick={() => setCurrentChallenge('defi1')}>Défi 1</button>
          <button onClick={() => setCurrentChallenge('defi2')}>Défi 2</button>
          <button onClick={() => setCurrentChallenge('defi3')}>Défi 3</button>
        </div>
        <div className="ranking-container">
          {renderRanking(currentChallenge)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Classement;
