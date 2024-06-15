import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import Compressor from 'compressorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faBan } from '@fortawesome/free-solid-svg-icons';

const MyAccount = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [form, setForm] = useState({
    pseudo: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    photo: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    pseudo: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const history = useHistory();

  useEffect(() => {
    const pseudo = localStorage.getItem('pseudo');
    const admin = localStorage.getItem('admin');
    if (pseudo) {
      if (admin == 1) {
        setIsAdmin(true);
      }
      setIsLoggedIn(true);
      // Fetch user data from API (replace with actual API call)
      fetch(`http://localhost:3001/api/users/get-pseudo/${pseudo}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            const userData = data;
            setUser(userData);
            setForm({
              pseudo: userData.pseudo,
              nom: userData.nom,
              prenom: userData.prenom,
              dateNaissance: formatDate(userData.dateNaissance),
              photo: userData.photo || '',
            });
            setPasswordForm({
              pseudo: userData.pseudo,
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setForm({ ...form, photo: reader.result });
          };
          reader.readAsDataURL(result);
        },
        error(err) {
          console.error('Error compressing image:', err);
        },
      });
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Submit updated profile data to API (replace with actual API call)
    fetch('http://localhost:3001/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setEditProfile(false);
        //refresh the page
        history.go(0);
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }
    fetch('http://localhost:3001/api/users/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordForm),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error) {
          setErrors({ oldPassword: data.error });
          return;
        } else {
          setErrors({ oldPassword: 'Succès! Mot de passe changé avec succès!' });
        }
        setEditPassword(false);
        return;
      })
      .catch(error => console.error('Error changing password:', error));
  };

  const routeChange = () => {
    let path = `/`;
    history.push(path);
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <Navbar />
        <div className="content myaccount-container">
          <h2>Vous devez être connecté pour accéder à cette page</h2>
          <FontAwesomeIcon icon={faBan} className="icon" />
          <div className="button-container">
            <button onClick={routeChange}>Se connecter</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <div className="content myaccount-container">
        <div className="profile-section">
          <img
            src={form.photo || ''}
            alt="Profil"
            className="profile-picture"
            onClick={() => document.getElementById('fileInput').click()}
          />
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <h2 className="user-name">{user?.nom} {user?.prenom}</h2>
        </div>
        <div className="user-info">
          <p>Défis réussis : {user?.nbDefis || 0}</p>
          <p>Étoiles : {user?.nbEtoiles || 0}</p>
        </div>
        {isAdmin ? (
          <div className="admin-button-container">
            <Link to="/admin" className="admin-button">
              <FontAwesomeIcon icon={faCogs} className="icon" />
              Gérer le site (Admin)
            </Link>
          </div>
        ) : null}

        <br />
        <div className="profile-edit-section">
          <h3>Mettre à jour le profil</h3>
          {editProfile ? (
            <form onSubmit={handleProfileSubmit}>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleInputChange}
                placeholder="Nom"
                required
              />
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleInputChange}
                placeholder="Prénom"
                required
              />
              <input
                type="date"
                name="dateNaissance"
                value={form.dateNaissance}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Sauvegarder</button>
              <button type="button" onClick={() => setEditProfile(false)}>Annuler</button>
            </form>
          ) : (
            <button onClick={() => setEditProfile(true)}>Modifier le profil</button>
          )}
          {errors.nom && <p className="error">{errors.nom}</p>}
        </div>

        <div className="password-change-section">
          <h3>Changer le mot de passe</h3>
          {editPassword ? (
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Ancien mot de passe"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nouveau mot de passe"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmer le mot de passe"
                required
              />
              <button type="submit">Changer le mot de passe</button>
              <button type="button" onClick={() => setEditPassword(false)}>Annuler</button>
            </form>
          ) : (
            <button onClick={() => setEditPassword(true)}>Changer le mot de passe</button>
          )}
          {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};