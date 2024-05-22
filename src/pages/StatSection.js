import React, { useState, useEffect } from 'react';

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
    <div>
      <h2>Stats</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="unUser" value={form.unUser} onChange={handleInputChange} placeholder="User Pseudo" required />
        <input type="number" name="nbDefis" value={form.nbDefis} onChange={handleInputChange} placeholder="Nombre de Défis" required />
        <input type="number" name="nbEtoiles" value={form.nbEtoiles} onChange={handleInputChange} placeholder="Nombre d'Étoiles" required />
        <input type="number" name="score" value={form.score} onChange={handleInputChange} placeholder="Score" required />
        <input type="number" name="nufs" value={form.nufs} onChange={handleInputChange} placeholder="Nufs" required />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {stats.map(stat => (
          <li key={stat.unUser}>
            {stat.unUser} - {stat.nbDefis} défis - {stat.nbEtoiles} étoiles - {stat.score} points - {stat.nufs} nufs
            <button onClick={() => handleDelete(stat.unUser)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatSection;
