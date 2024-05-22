import React, { useState, useEffect } from 'react';

const DefiUserSection = () => {
  const [defiUsers, setDefiUsers] = useState([]);
  const [form, setForm] = useState({
    unUser: '',
    unDefi: 0,
    dateDebut: '',
    dateFin: '',
    nbEtoilesObtenu: 0,
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
    <div>
      <h2>Defi Users</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="unUser" value={form.unUser} onChange={handleInputChange} placeholder="User Pseudo" required />
        <input type="number" name="unDefi" value={form.unDefi} onChange={handleInputChange} placeholder="Defi ID" required />
        <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleInputChange} required />
        <input type="date" name="dateFin" value={form.dateFin} onChange={handleInputChange} required />
        <input type="number" name="nbEtoilesObtenu" value={form.nbEtoilesObtenu} onChange={handleInputChange} placeholder="Étoiles Obtenues" required />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {defiUsers.map(du => (
          <li key={`${du.unUser}-${du.unDefi}`}>
            {du.unUser} - Défi {du.unDefi} - {du.dateDebut} à {du.dateFin} - {du.nbEtoilesObtenu} étoiles
            <button onClick={() => handleDelete(du.unUser, du.unDefi)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefiUserSection;
