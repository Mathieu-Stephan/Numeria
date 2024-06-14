import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Navbar from './NavBar';
import Footer from './Footer';
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

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
      const pseudo = localStorage.getItem('pseudo');
      if (pseudo) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const birthDate = new Date(formData.dateNaissance);
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const dayDiff = now.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (!formData.pseudo || formData.pseudo.length > 15) {
      newErrors.pseudo = "Le pseudonyme n'est pas valide";
    }

    if (!formData.email) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide";
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    }

    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.dateNaissance) {
      newErrors.dateNaissance = 'La date de naissance est requise';
    } else if (age < 15 || age > 25) {
      newErrors.dateNaissance = 'L\'âge doit être compris entre 15 et 25 ans';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
        setErrors({ form: 'Une erreur est survenue lors de l\'inscription' });
      }
    }
  };

  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/`;
    history.push(path);
  }

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
              {errors.pseudo && <p className="error">{errors.pseudo}</p>}
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
              {errors.email && <p className="error">{errors.email}</p>}
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
              {errors.motDePasse && <p className="error">{errors.motDePasse}</p>}
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
              {errors.nom && <p className="error">{errors.nom}</p>}
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
              {errors.prenom && <p className="error">{errors.prenom}</p>}
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
              {errors.dateNaissance && <p className="error">{errors.dateNaissance}</p>}
            </div>
            <button type="submit" className="submit-button">S'inscrire</button>
            {errors.form && <p className="error">{errors.form}</p>}
          </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
