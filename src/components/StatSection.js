import React, { useState, useEffect } from 'react';
import '../styles/Admin.css'; 

const StatSection = () => {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState({
    unUser: '',
    nbDefis: 0,
    nbEtoiles: 0,
    score: 0,
    nufs: 0,
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/stats')
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        setStats([...stats, data]);
      })
      .catch(error => console.error('Error adding stat:', error));
  };

  const handleDelete = (unUser) => {
    fetch(`http://localhost:3001/api/stats/${unUser}`, {
      method: 'DELETE',
    })
      .then(() => {
        setStats(stats.filter(stat => stat.unUser !== unUser));
      })
      .catch(error => console.error('Error deleting stat:', error));
  };

  return (
    <div className="admin-stat-section">
      <h2>Stats</h2>
      <form onSubmit={handleSubmit} className="admin-stat-form">
        <div className="admin-input-container">
          <input type="text" name="unUser" value={form.unUser} onChange={handleInputChange} placeholder="User Pseudo" required />
        </div>
        <div className="admin-input-container">
          <input type="number" name="nbDefis" value={form.nbDefis} onChange={handleInputChange} placeholder="Nombre de Défis" required />
        </div>
        <div className="admin-input-container">
          <input type="number" name="nbEtoiles" value={form.nbEtoiles} onChange={handleInputChange} placeholder="Nombre d'Étoiles" required />
        </div>
        <div className="admin-input-container">
          <input type="number" name="nufs" value={form.nufs} onChange={handleInputChange} placeholder="Nufs" required />
        </div>
        <button type="submit" className="submit-button">Ajouter</button>
      </form>
      <ul className="list">
        {stats.map(stat => (
          <li key={stat.unUser} className="item">
            {stat.unUser} - {stat.nbDefis} défis - {stat.nbEtoiles} étoiles - {stat.nufs} nufs
            <button onClick={() => handleDelete(stat.unUser)} className="delete-button">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatSection;
