import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from "@fortawesome/free-solid-svg-icons";


const NotFoundPage = () => {
    return (
        <div className="container">
            <div className='content'>
                <div className="not-found">
                    <h1>404</h1>
                    <h2>Page non trouvée</h2>
                    <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
                    <Link to="/" className="btn"> <FontAwesomeIcon icon={faHouse} />  Retour à l'accueil !</Link>
                    
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;