import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import NavigationMenu from './NavigationMenu';
import API from '../api/API';

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
    </div>
  );
}
