import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <div>
        <img src="CypherCode.png" alt="CypherCode Logo" id="logo" />
        <h1>Bienvenue sur CypherCode</h1>
        <p>Le site de défis de code</p>
        <Link to="/challenges">Défis</Link>
      </div>
    </>
  );
}
