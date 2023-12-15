import React from 'react';
import Navbar from './NavBar';

const AboutPage = () => {
    return (
        <div className="container">
            <Navbar />
            <div className='content'>
                <img src="Logo_Numeria.png" alt="CypherCode Logo" id="logo" />
                <h1>A propos</h1>
                <p>Je ne sais pas quoi mettre ici, donc je vais juste mettre un lorem ipsum</p>
                <p>Bonum vinum laetificat cor hominis, et quod facit bonum, facit bonum vinum.</p>
                <p>Attend une seconde, c'est pas le lorem ipsum ça !</p>
            </div>
        </div>
    );
};

export default AboutPage;
