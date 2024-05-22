import React, { useState, useEffect } from 'react';

const DefiSection = () => {
  const [defis, setDefis] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    nbEtoiles: 0,
    categorie: '',
    indice: '',
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
    <div>
      <h2>Defis</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="titre" value={form.titre} onChange={handleInputChange} placeholder="Titre" required />
        <input type="text" name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="number" name="nbEtoiles" value={form.nbEtoiles} onChange={handleInputChange} placeholder="Nombre d'Étoiles" required />
        <input type="text" name="categorie" value={form.categorie} onChange={handleInputChange} placeholder="Catégorie" required />
        <input type="text" name="indice" value={form.indice} onChange={handleInputChange} placeholder="Indice" />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {defis.map(defi => (
          <li key={defi.idDefi}>
            {defi.titre} - {defi.description} - {defi.nbEtoiles} étoiles - {defi.categorie}
            <button onClick={() => handleDelete(defi.idDefi)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefiSection;
