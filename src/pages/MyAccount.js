import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const MyAccount = () => {
  const user = {
    profilePicture: 'https://via.placeholder.com/150', // URL de la photo de profil de l'utilisateur
    name: 'John Doe', // Nom de l'utilisateur
    challengesCompleted: 10, // Nombre de défis réussis
    stars: 5 // Nombre d'étoiles
  };

  return (
    <div className="container">
      <Navbar />
      <div className="content myaccount-container">
        <div className="profile-section">
          <img src={user.profilePicture} alt="Profil" className="profile-picture" />
          <h2 className="user-name">{user.name}</h2>
        </div>
        <div className="user-info">
          <p>Défis réussis : {user.challengesCompleted}</p>
          <p>Étoiles : {user.stars}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;