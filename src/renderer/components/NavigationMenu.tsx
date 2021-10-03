import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API } from '../api/API';

type NavigationMenuProps = {
  role: string;
};

export default function NavigationMenu({ role }: NavigationMenuProps) {
  const history = useHistory();
  const logout = () => {
    API.logout();
    history.push('/');
  };

  if (role === 'base_worker') {
    return (
      <div>
        <Link to="/main/mission">Mission</Link>
        <Link to="/main/dispatch">Dispatch</Link>
        <Link to="/main/records">Records</Link>
        <Link to="/main/history">History</Link>
        <Link to="/main/team">Team</Link>
        <button type="submit" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }
  return (
    <div>
      <Link to="/main/records">Records</Link>
      <Link to="/main/history">History</Link>
      <Link to="/main/team">Team</Link>
      <Link to="/main/team_member">Add Member</Link>
      <button type="submit" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
