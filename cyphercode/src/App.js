import './App.css';
import React from "react"
import { Route, Switch } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ChallengesPage from "./pages/ChallengesPage"

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/challenges" component={ChallengesPage} />
    </Switch>
  )
}


