import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import axios from 'axios';

const SignIn = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Récupérer les utilisateurs lors du montage du composant
    axios.get('http://localhost:3001/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
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
      let userConnected = null;
      users.forEach((user) => {
        if (user.email === formData.email && user.motDePasse === formData.password) {
          userConnected = user;
          localStorage.setItem("pseudo", user.pseudo);
          localStorage.setItem("email", user.email);
          localStorage.setItem("nom", user.nom);
          localStorage.setItem("prenom", user.prenom);
          localStorage.setItem("admin", user.estAdmin);
        }
      })
      if (userConnected) {
        setIsSubmitted(true);
        window.location.href = "http://localhost:3000/";
      } else {
        setErrors({ form: "Email ou mot de passe incorrect" });
      }
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Connexion</h1>
        {isSubmitted ? (
          <p>Connexion réussie!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Adresse e-mail"
              />
              <label>Email:</label>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
              />
              <label>Mot de passe:</label>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            {errors.form && <p className="error">{errors.form}</p>}
            <button type="submit" className="submit-button">Se connecter</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
