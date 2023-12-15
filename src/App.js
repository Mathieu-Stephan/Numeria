import './App.css';
import React from "react";
import { Route, Switch } from "react-router-dom"
import HomePage from "./pages/HomePage";
import About from "./pages/About";
export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage}></Route>
      <Route path="/about" component={About}></Route>
    </Switch>
  )
}


