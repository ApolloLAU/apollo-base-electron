import React, { useEffect } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

import './App.global.css';
import Login from './components/Login';
import { API } from './api/API';
import MainScreen from './components/MainScreen';

export default function App() {
  useEffect(() => {
    API.initAPI();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/main" component={MainScreen} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}
