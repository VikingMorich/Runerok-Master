import React, { useState } from "react";
import "./index.css"
import "./scss/main.scss"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'
import Home from './components/Home'
import Room from './components/Room'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default function App() {

return (
<Router>
  <main>
    <Header /> 
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/contact" />
      <Route path="/room" component={Room}/>
      <Route render={() => <h1>404: page not found</h1>} />
    </Switch>
    <ToastContainer />
  </main>
</Router>
  );
}