import React, { useState, useEffect } from 'react';
import './Admin.css'; 

const DefiUserSection = () => {
  const [defiUsers, setDefiUsers] = useState([]);
  const [form, setForm] = useState({
    unUser: '',
    unDefi: 0,
    dateDebut: '',
    dateFin: '',
    nbEtoiles: 0,
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/defiUsers')
      .then(response => response.json())
      .then(data => setDefiUsers(data))
      .catch(error => console.error('Error fetching defiUsers:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/defiUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        setDefiUsers([...defiUsers, data]);
      })
      .catch(error => console.error('Error adding defiUser:', error));
  };

  const handleDelete = (unUser, unDefi) => {
    fetch(`http://localhost:3001/api/defiUsers/${unUser}/${unDefi}`, {
      method: 'DELETE',
    })
      .then(() => {
        setDefiUsers(defiUsers.filter(du => du.unUser !== unUser || du.unDefi !== unDefi));
      })
      .catch(error => console.error('Error deleting defiUser:', error));
  };

  return (
    <div className="admin-defis-container">
      <h2>Defi Users</h2>
      <form onSubmit={handleSubmit} className="admin-input-container">
        <input type="text" name="unUser" value={form.unUser} onChange={handleInputChange} placeholder="User Pseudo" required />
        <input type="number" name="unDefi" value={form.unDefi} onChange={handleInputChange} placeholder="Defi ID" required />
        <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleInputChange} required />
        <input type="date" name="dateFin" value={form.dateFin} onChange={handleInputChange} required />
        <input type="number" name="nbEtoiles" value={form.nbEtoiles} onChange={handleInputChange} placeholder="Étoiles" required />
        <button type="submit" className="submit-button">Ajouter</button>
      </form>
      <ul className="list">
        {defiUsers.map(du => (
          <li key={`${du.unUser}-${du.unDefi}`} className="card">
            <h3>{du.unUser}</h3>
            <p>Défi {du.unDefi}</p>
            <p>Du {du.dateDebut} au {du.dateFin}</p>
            <p>{du.nbEtoiles} étoiles</p>
            <button onClick={() => handleDelete(du.unUser, du.unDefi)} className="delete-button">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefiUserSection;
