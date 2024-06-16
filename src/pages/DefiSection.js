import React, { useState, useEffect } from 'react';
import './Admin.css'; 

const DefiSection = () => {
  const [defis, setDefis] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    nbEtoiles: 0,
    difficulte: '', // Corrected the form key
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/defis')
      .then(response => response.json())
      .then(data => setDefis(data))
      .catch(error => console.error('Error fetching defis:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/defis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        setDefis([...defis, data]);
      })
      .catch(error => console.error('Error adding defi:', error));
  };

  const handleDelete = (idDefi) => {
    fetch(`http://localhost:3001/api/defis/${idDefi}`, {
      method: 'DELETE',
    })
      .then(() => {
        setDefis(defis.filter(defi => defi.idDefi !== idDefi));
      })
      .catch(error => console.error('Error deleting defi:', error));
  };

  return (
    <div className="admin-defis-container">
      <h2>Défis</h2>
      <form onSubmit={handleSubmit} className="admin-input-container">
        <input type="text" name="titre" value={form.titre} onChange={handleInputChange} placeholder="Titre" required />
        <input type="text" name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="number" name="nbEtoiles" value={form.nbEtoiles} onChange={handleInputChange} placeholder="Nombre d'Étoiles" required />
        <input type="text" name="difficulte" value={form.difficulte} onChange={handleInputChange} placeholder="Difficulté" required />
        <button type="submit" className="submit-button">Ajouter</button>
      </form>
      <ul className="list">
        {defis.map(defi => (
          <li key={defi.idDefi} className="card">
            <h3>{defi.titre}</h3>
            <p>{defi.description}</p>
            <p>{defi.nbEtoiles} étoiles</p>
            <p>Difficulté: {defi.difficulte}</p>
            <button onClick={() => handleDelete(defi.idDefi)} className="delete-button">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefiSection;
