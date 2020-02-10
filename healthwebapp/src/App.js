import React, {useState} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Routes from './components/routes'

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
    <div className="App">
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

export default App;
