import React, { useState, useEffect } from 'react';
import './Admin.css';

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    pseudo: '',
    email: '',
    motDePasse: '',
    nom: '',
    prenom: '',
    dateInscription: '',
    dateNaissance: '',
    photo: '',
    estAdmin: false,
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        setUsers([...users, data]);
      })
      .catch(error => console.error('Error adding user:', error));
  };

  const handleDelete = (pseudo) => {
    fetch(`http://localhost:3001/api/users/${pseudo}`, {
      method: 'DELETE',
    })
      .then(() => {
        setUsers(users.filter(user => user.pseudo !== pseudo));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div className="admin-users-container">
      <h2>Users</h2>
      <form onSubmit={handleSubmit} className="admin-input-container">
        <input type="text" name="pseudo" value={form.pseudo} onChange={handleInputChange} placeholder="Pseudo" required />
        <input type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" required />
        <input type="password" name="motDePasse" value={form.motDePasse} onChange={handleInputChange} placeholder="Mot de passe" required />
        <input type="text" name="nom" value={form.nom} onChange={handleInputChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={form.prenom} onChange={handleInputChange} placeholder="Prénom" required />
        <input type="date" name="dateInscription" value={form.dateInscription} onChange={handleInputChange} required />
        <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={handleInputChange} required />
        <input type="text" name="photo" value={form.photo} onChange={handleInputChange} placeholder="Photo URL" />
        <label>
          Est Admin:
          <input type="checkbox" name="estAdmin" checked={form.estAdmin} onChange={e => setForm({ ...form, estAdmin: e.target.checked })} />
        </label>
        <button type="submit" className="submit-button">Ajouter</button>
      </form>
      <ul className="list">
        {users.map(user => (
          <li key={user.pseudo} className="card">
            <h3>{user.pseudo}</h3>
            <p>{user.nom} {user.prenom}</p>
            <p>{user.email}</p>
            <button onClick={() => handleDelete(user.pseudo)} className="delete-button">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSection;
