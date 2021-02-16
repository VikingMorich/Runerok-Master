import React, {useState} from "react";
import "./index.css"
import "./scss/main.scss"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initFirebase } from './firestorefunc'
import Header from './components/Header'
import Home from './components/Home'
import Room from './components/Room'
import Game from './components/Game'
import Contact from './components/Contact'
import Arrow from './components/Arrow'
import { useTranslation } from "react-i18next"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default function App() {
  const [t] = useTranslation("global")
  initFirebase(t)
  const [showOnScroll, setShowOnScroll] = useState(false)

  useScrollPosition(({ prevPos, currPos }) => {
    currPos.y !== 0 ? setShowOnScroll(true) : setShowOnScroll(false)
  })

return (
<Router>
  <main>
    <Header /> 
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/contact" component={Contact}/>
      <Route path="/room" component={Room}/>
      <Route path="/game" component={Game}/>
      <Route render={() => <h1>404: page not found</h1>} />
    </Switch>
    <ToastContainer />
    {showOnScroll &&
      <Arrow />
    }
  </main>
</Router>
  );
}