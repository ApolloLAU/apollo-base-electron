import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import { API } from '../api/API';
import TeamScreen from './TeamScreen';
import OperatorScreen from './OperatorScreen';
import HistoryScreen from './HistoryScreen';
import PastMissionScreen from './PastMissionScreen';
import AddMemberScreen from './AddMemberScreen';

export default function MainScreen() {
  const history = useHistory();
  const location = useLocation();
  const [role, setRole] = useState('');

  useEffect(() => {
    console.log('USE EFFECT CALLED!!');
    const user = API.getLoggedInUser();
    console.log(location.pathname);
    if (user) {
      API.getWorkerForUser(user).then((r) => setRole(r.getRole()));
    } else if (location.pathname !== '/admin') history.push('/');
  }, [location]);

  return (
    <div>
      <NavigationMenu role={role} />
      <Switch>
        <Route path="/main/team/:id" component={OperatorScreen} />
        <Route path="/main/team" component={TeamScreen} />
        <Route path="/main/history/:id" component={PastMissionScreen} />
        <Route path="/main/history" component={HistoryScreen} />
        <Route path="/main/add_member" component={AddMemberScreen} />
      </Switch>
    </div>
  );
}
