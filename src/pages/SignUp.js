import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    motDePasse: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    dateInscription: new Date().toISOString().split('T')[0],
    photo: 'https://via.placeholder.com/150',
    estAdmin: 0
  });

  const [errors, setErrors] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const pseudo = localStorage.getItem('pseudo');
    setIsLoggedIn(!!pseudo);
  }, []);

  const validateForm = () => {
    if (
      !formData.pseudo ||
      !formData.email ||
      !formData.motDePasse ||
      !formData.nom ||
      !formData.prenom ||
      !formData.dateNaissance
    ) {
      setErrors('Tous les champs doivent être remplis');
      return false;
    }

    const now = new Date();
    const birthDate = new Date(formData.dateNaissance);
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const dayDiff = now.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 15 || age > 25) {
      setErrors('L\'âge doit être compris entre 15 et 25 ans');
      return false;
    }

    setErrors('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3001/api/users', formData);
        console.log('Form data:', response.data);
        setIsSubmitted(true);
        window.location.href = "http://localhost:3000/signin";
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors('Une erreur est survenue lors de l\'inscription');
      }
    }
  };

  const history = useHistory();
  const routeChange = () => { 
    let path = `/`;
    history.push(path);
  };

  if (isLoggedIn) {
    return (
      <div className="container">
        <Navbar />
        <div className="content myaccount-container">
          <h2>Vous devez être déconnecté pour accéder à cette page</h2>
          <FontAwesomeIcon icon={faBan} className="icon" />
          <div className='button-container'>
            <button onClick={routeChange}>Retour</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <div className="content signup-container">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-container">
            <input
              type="text"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              placeholder="Pseudonyme"
            />
            <label>Pseudonyme</label>
          </div>
          <div className="input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <label>Email</label>
          </div>
          <div className="input-container">
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              placeholder="Mot de passe"
            />
            <label>Mot de passe</label>
          </div>
          <div className="input-container">
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom"
            />
            <label>Nom</label>
          </div>
          <div className="input-container">
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom"
            />
            <label>Prénom</label>
          </div>
          <div className="input-container">
            <input
              type="date"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              placeholder="Date de naissance"
            />
            <label>Date de naissance</label>
          </div>
          {errors && <p className="error">{errors}</p>}
          <button type="submit" className="submit-button">S'inscrire</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
