import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const HomePage = () => {
    return (
        <div className='container'>
            <Navbar />
            <div className='content'>
                <img src="Logo_B.png" alt="CypherCode Logo" id="logo" />
                <h1>Numeria</h1>
                
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;