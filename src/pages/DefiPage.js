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
          <div className="defi-image">
            <img src={defi.image} alt={defi.titre} />
          </div>
          <div className="defi-details">
            <p>{defi.description}</p>
            <p>{defi.info}</p>
            <button className="start-button">Commencer le défi</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefiPage;
