import React from 'react';
import Navbar from './NavBar';

const AboutPage = () => {
    return (
        <div className="container">
            <Navbar />
            <div className='content'>
                <img src="Logo_B.png" alt="CypherCode Logo" id="logo" />
                <h1>Conditions générales d'utilisation</h1>
                <p>
                    Ceci est un test pour savoir un truc nul.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
