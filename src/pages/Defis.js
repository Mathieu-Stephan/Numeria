import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Defis = () => {
    fetch('http://localhost:3001/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur lors de la récupération des données', error));

    return (
        <div className="container">
            <Navbar />
            <Footer />
        </div>
    );
}

export default Defis;