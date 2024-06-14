import './App.css';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import NotFoundPage from './pages/NotFoundPage';
import Defis from './pages/Defis';
import DefiPage from './pages/DefiPage'; // Importer DefiPage
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import MyAccount from './pages/MyAccount';
import AdminPage from './pages/AdminPage';
import Classement from './pages/Classement';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage}></Route>
      <Route path="/about" component={About}></Route>
      <Route exact path="/defis" component={Defis}></Route>
      <Route path="/defis/:id" component={DefiPage}></Route> {/* Ajoutez cette ligne */}
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/signin" component={SignIn}></Route>
      <Route path="/account" component={MyAccount}></Route>
      <Route path="/classement" component={Classement}></Route>
      <Route path="/admin" component={AdminPage} />
      <Route path="/404" component={NotFoundPage} />
      <Redirect to="/404" />
    </Switch>
  );
}
