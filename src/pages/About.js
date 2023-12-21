import React from 'react';
import Navbar from './NavBar';

const AboutPage = () => {
    return (
        <div className="container">
            <Navbar />
            <div className='content'>
                <img src="Logo_B.png" alt="CypherCode Logo" id="logo" />
                <h1><b>Conditions Générales d'Utilisation (CGU) de Numéria</b></h1>
                <p>
                Bienvenue sur Numéria, la plateforme de défis informatiques développée par l'association SDJJ. Avant d'utiliser notre application, veuillez lire attentivement les Conditions Générales d'Utilisation ci-dessous.
                En accédant et en utilisant Numéria, vous acceptez de vous conformer aux présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                </p>
                <h2><b>1. Utilisation de Numéria</b></h2>
                <p>
                1.1 Compte Utilisateur : Pour participer aux défis, vous devez créer un compte utilisateur en fournissant des informations précises et véridiques. Vous êtes responsable de la confidentialité de vos identifiants de connexion.
                <br />
                1.2 Âge Minimum : Numéria est destiné aux utilisateurs âgés de 15 à 25 ans. Si votre âge dépasse 25 ans après la création du compte, vous pourrez conserver le compte mais ne pourrez plus participer aux défis.
                <br />
                1.3 Respect des Lois et Règlements : En utilisant Numéria, vous vous engagez à respecter toutes les lois et réglementations applicables.
                </p>
                <h2><b>2. Défis et Classements</b></h2>
                <p>
                2.1 Participation aux Défis : Vous pouvez participer aux défis disponibles sur Numéria. Les résultats seront évalués en fonction de la qualité de vos solutions, du temps passé, et d'autres critères définis dans le cahier des charges.
                <br />
                2.2 Classements : Numéria propose un système de classement général des utilisateurs ainsi que des classements spécifiques à chaque défi. Ces classements sont basés sur vos performances et peuvent être consultés publiquement.
                </p>
                <h2><b>3. Responsabilités et Obligations</b></h2>
                <p>
                3.1 Utilisation Légitime : Vous vous engagez à utiliser Numéria de manière légitime et à ne pas engager d'activités illégales, frauduleuses ou nuisibles.
                <br />
                3.2 Contenu Utilisateur : En soumettant du contenu sur Numéria, vous garantissez que vous avez les droits nécessaires sur ce contenu. Vous acceptez de ne pas soumettre de contenu offensant, diffamatoire ou en violation des droits d'autrui.
                </p>
                <h2><b>4. Propriété Intellectuelle</b></h2>
                <p>
                4.1 Droits d'Auteur : Numéria et son contenu sont protégés par les lois sur le droit d'auteur. Vous acceptez de respecter ces droits et de ne pas reproduire, distribuer ou modifier le contenu sans autorisation.
                </p>
                <h2><b>5. Modifications des CGU</b></h2>
                <p>
                5.1 Mises à Jour : Les présentes CGU peuvent être modifiées périodiquement. Les utilisateurs seront informés des mises à jour importantes. Eh vraiment je suis fatigué là he. En continuant à utiliser Numéria après une mise à jour, vous acceptez les nouvelles conditions.
                </p>
                <br />
                <br />
                <p>
                En utilisant Numéria, vous acceptez ces CGU. Si vous avez des questions ou des préoccupations, veuillez nous contacter aux adresses e-mail fournies dans le cahier des charges.

                Merci de votre compréhension et bienvenue sur Numéria !
                </p> 
            </div>
        </div>
    );
};

export default AboutPage;
