import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import { API } from '../api/API';
import TeamScreen from './TeamScreen';
import OperatorScreen from './OperatorScreen';

export default function MainScreen() {
  const history = useHistory();
  const [role, setRole] = useState('');

  useEffect(() => {
    const user = API.getLoggedInUser();
    if (user) {
      API.getRoleForUser(user).then((r) => setRole(r));
    } else {
      history.push('/');
    }
  }, []);

  return (
    <div>
      <NavigationMenu role={role} />
      <Switch>
        <Route path="/main/team/:id" component={OperatorScreen} />
        <Route path="/main/team" component={TeamScreen} />
      </Switch>
    </div>
  );
}
