import React, { useState } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      // Soumettre les données
      console.log('Form data:', formData);
      setIsSubmitted(true);
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
            <button type="submit">Se connecter</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
