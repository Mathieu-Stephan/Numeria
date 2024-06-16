import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGitlab } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-links">
                    <a href="https://github.com/nathan-basol" className="footer-link">
                        <FontAwesomeIcon icon={faGithub} />
                        <p>GitHub</p>
                    </a>
                    <a href="https://gitlab.com/sae-defi-cyphercode/SDJJ-Numeria " className="footer-link">
                        <FontAwesomeIcon icon={faGitlab} />
                        <p>GitLab</p>
                    </a>
                </div>
                <div className="footer-text">
                    <p>© 2024 Numeria</p>
                    <p>Tous droits réservés</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;