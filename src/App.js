import './App.css';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import NotFoundPage from './pages/NotFoundPage';
import Defis from './pages/Defis';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminPage from './pages/AdminPage';
import { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/defis');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={HomePage}></Route>
      <Route path="/about" component={About}></Route>
      <Route path="/defis" component={Defis}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/signin" component={SignIn}></Route>
      <Route path="/admin" component={AdminPage} />
      <Route path="/404" component={NotFoundPage} />
      <Redirect to="/404" />
    </Switch>
  );
}
