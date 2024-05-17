import React, { useState } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const SignUp = () => {
  const [formData, setFormData] = useState({
    pseudonyme: '',
    email: '',
    password: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    dateInscription: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const birthDate = new Date(formData.dateNaissance);
    const age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const dayDiff = now.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (!formData.pseudonyme || formData.pseudonyme.length > 15) {
        newErrors.pseudonyme = 'Le pseudonyme est requis et doit contenir au maximum 15 caractères';
    }

    if (!formData.email) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Soumettre les données
      console.log('Form data:', formData);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="content signup-container"> {/* Ajout de la classe signup-container */}
        <h1>Inscription</h1>
        {isSubmitted ? (
          <p>Inscription réussie!</p>
        ) : (
          <form onSubmit={handleSubmit} className="signup-form"> {/* Ajout de la classe signup-form */}
            <div className="input-container"> {/* Ajout de la classe input-container */}
              <input
                type="text"
                name="pseudonyme"
                value={formData.pseudonyme}
                onChange={handleChange}
                placeholder="Pseudonyme" // Ajout de l'attribut placeholder
              />
              <label>Pseudonyme</label> {/* Ajout du libellé */}
              {errors.pseudonyme && <p className="error">{errors.pseudonyme}</p>}
            </div>
            <div className="input-container"> {/* Ajout de la classe input-container */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" // Ajout de l'attribut placeholder
              />
              <label>Email</label> {/* Ajout du libellé */}
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="input-container"> {/* Ajout de la classe input-container */}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe" // Ajout de l'attribut placeholder
              />
              <label>Mot de passe</label> {/* Ajout du libellé */}
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="input-container"> {/* Ajout de la classe input-container */}
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom" // Ajout de l'attribut placeholder
              />
              <label>Nom</label> {/* Ajout du libellé */}
              {errors.nom && <p className="error">{errors.nom}</p>}
            </div>
            <div className="input-container"> {/* Ajout de la classe input-container */}
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Prénom" // Ajout de l'attribut placeholder
              />
              <label>Prénom</label> {/* Ajout du libellé */}
              {errors.prenom && <p className="error">{errors.prenom}</p>}
            </div>
            <div className="input-container"> {/* Ajout de la classe input-container */}
              <input
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                placeholder="Date de naissance" // Ajout de l'attribut placeholder
              />
              <label>Date de naissance</label> {/* Ajout du libellé */}
              {errors.dateNaissance && <p className="error">{errors.dateNaissance}</p>}
            </div>
            <button type="submit" className="submit-button">S'inscrire</button> {/* Ajout de la classe submit-button */}
          </form>
        )}
      </div>
      <Footer/>
</div>
);
};

export default SignUp;
