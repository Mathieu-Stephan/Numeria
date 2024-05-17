import './App.css';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import NotFoundPage from './pages/NotFoundPage';
import Defis from './pages/Defis';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage}></Route>
      <Route path="/about" component={About}></Route>
      <Route path="/defis" component={Defis}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/signin" component={SignIn}></Route>
      <Route path="/404" component={NotFoundPage} />
      <Redirect to="/404" />
    </Switch>
  );
}
