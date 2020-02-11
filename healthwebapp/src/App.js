import React, {useState, useEffect} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';

import Routes from './components/routes';
import { BrowserRouter } from "react-router-dom";

function App(props) {
  const [isAuthenticated, userHasAuthenticated, isDoctor] = useState(false);

  useEffect(() => {
    //onLoad();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header appProps={{ isAuthenticated, userHasAuthenticated, isDoctor }}></Header>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, isDoctor }} />
      </BrowserRouter>
    </div>
  );
}

export default App;
