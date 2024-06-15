import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import './HomePage.css';

const HomePage = () => {
    const [defiData, setDefiData] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [defiCount, setDefiCount] = useState(0);
    const [totalNufs, setTotalNufs] = useState(0);
    const [successfulDefis, setSuccessfulDefis] = useState(0);

    useEffect(() => {
        // Récupérer les défis
        fetch('http://localhost:3001/api/defis')
            .then(response => response.json())
            .then(data => setDefiData(data))
            .catch(error => console.error('Erreur lors de la récupération des données des défis', error));

        // Récupérer le nombre d'utilisateurs
        fetch('http://localhost:3001/api/users')
            .then(response => response.json())
            .then(data => setUserCount(data.length))
            .catch(error => console.error('Erreur lors de la récupération du nombre d\'utilisateurs', error));

        // Récupérer le nombre total d'étoiles obtenues par les utilisateurs
        fetch('http://localhost:3001/api/stats/totalNufs')
            .then(response => response.json())
            .then(data => setTotalNufs(data[0].nufs))
            .catch(error => console.error('Erreur lors de la récupération du nombre total d\'étoiles', error));

        // Récupérer le nombre de défis réussis
        fetch('http://localhost:3001/api/defiUsers/count')
            .then(response => response.json())
            .then(data => setSuccessfulDefis(data[0].defis))
            .catch(error => console.error('Erreur lors de la récupération du nombre de défis réussis', error));

        // Récupérer le nombre total de défis
        fetch('http://localhost:3001/api/defis')
            .then(response => response.json())
            .then(data => setDefiCount(data.length))
            .catch(error => console.error('Erreur lors de la récupération du nombre total de défis', error));
    }, []);

    return (
        <div className='container'>
            <Navbar />
            <div className='content'>
                <img src="Logo_B.png" alt="CypherCode Logo" id="logo" />
                <h1>Numeria</h1>
                <p>Bienvenue sur Numeria, la plateforme ultime pour relever des défis passionnants et développer vos compétences en codage !</p>
                
                <div className="counters">
                    <div className="counter">
                        <h3>Nombre d'Utilisateurs</h3>
                        <p>{userCount}</p>
                    </div>
                        
                    <div className="counter">
                        <h3>Nombre de Défis</h3>
                        <p>{defiCount}</p>
                    </div>
                    <div className="counter">
                        <h3>Total Nufs obtenus</h3>
                        <p>{totalNufs}</p>
                    </div>
                    <div className="counter">
                        <h3>Total Défis réussis</h3>
                        <p>{successfulDefis}</p>
                    </div>
                </div>

                <div className="defis">
                    <h2>Liste des Défis</h2>
                    <ul>
                        {defiData.length > 0 ? (
                            defiData.map(defi => (
                                <li key={defi.id}>
                                    {defi.titre}
                                </li>
                            ))
                        ) : (
                            <li>Aucun défi n'a été trouvé.</li>
                        )}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;