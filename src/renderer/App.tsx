import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

import './App.global.css';
import Login from './components/Login';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}
