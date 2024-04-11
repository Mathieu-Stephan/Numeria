import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const HomePage = () => {
    const [defiData, setDefiData] = useState([]);

    useEffect(() => {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => setDefiData(data))
            .catch(error => console.error('Erreur lors de la récupération des données', error));

        console.log(defiData);
    }, []);

    return (
        <div className='container'>
            <Navbar />
            <div className='content'>
                <img src="Logo_B.png" alt="CypherCode Logo" id="logo" />
                <h1>Numeria</h1>
                <ul>
                    {
                    defiData.length > 0 && defiData.map(defi => (
                        <li key={defi.id}>
                            {defi.nom} - {defi.description}
                        </li>
                    ))
                    }
                    {defiData.length <= 0 && (<li>Aucun défi n'a été trouvé.</li>)}
                </ul>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
