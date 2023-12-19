import React from 'react';
import Navbar from './NavBar';

const HomePage = () => {
    return (
        <div className='container'>
            <Navbar />
            <div className='content'>
                <img src="Logo_B.png" alt="CypherCode Logo" id="logo" />
                <h1>Accueil</h1>
                <p>Je ne sais pas quoi mettre ici, donc je vais juste mettre un lorem ipsum</p>
            </div>
        </div>
    );
}

export default HomePage;