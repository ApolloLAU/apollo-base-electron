import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { API } from '../../api/API';
import './css/NavigationMenu.scss';

import app_icon from '../../../../assets/FRSLogo.png';
import ambulance from '../../../../assets/ambulance.png';
import map from '../../../../assets/map.png';
import records from '../../../../assets/medical-folder.png';
import history_icon from '../../../../assets/history.png';
import team_icon from '../../../../assets/record.png';
import logout_icon from '../../../../assets/logout.png';
import add_user from '../../../../assets/user.png';

type NavigationMenuProps = {
  role: string;
};

export default function NavigationMenu({ role }: NavigationMenuProps) {
  const history = useHistory();
  const loc = useLocation();
  const logout = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    API.logOut().then(() => history.push('/'));
  };

  const isCurrentLoc = (path: string) => loc.pathname.includes(path);

  if (role === 'base_worker') {
    return (
      <div className="nav-menu">
        <img src={app_icon} alt="app-icon" className="logo" />
        <Link
          to="/main/mission"
          className={
            isCurrentLoc('mission') ? 'nav-button-active' : 'nav-button'
          }
        >
          <img src={ambulance} alt="mission" className="nav-icon" />
          Mission
        </Link>
        <Link
          to="/main/dispatch"
          className={
            isCurrentLoc('dispatch') ? 'nav-button-active' : 'nav-button'
          }
        >
          <img src={map} alt="map" className="nav-icon" />
          Dispatch
        </Link>
        <Link
          to="/main/records"
          className={
            isCurrentLoc('records') ? 'nav-button-active' : 'nav-button'
          }
        >
          <img src={records} alt="records" className="nav-icon" />
          Records
        </Link>
        <Link
          to="/main/history"
          className={
            isCurrentLoc('history') ? 'nav-button-active' : 'nav-button'
          }
        >
          <img src={history_icon} alt="history" className="nav-icon" />
          History
        </Link>
        <Link
          to="/main/team"
          className={isCurrentLoc('team') ? 'nav-button-active' : 'nav-button'}
        >
          <img src={team_icon} alt="team" className="nav-icon" />
          Team
        </Link>
        <button type="submit" onClick={logout} className="old-button">
          <img src={logout_icon} alt="team" className="nav-icon" />
          Logout
        </button>
      </div>
    );
  }
  return (
    <div className="nav-menu">
      <img src={app_icon} alt="app-icon" className="logo" />
      <Link
        to="/main/records"
        className={isCurrentLoc('records') ? 'nav-button-active' : 'nav-button'}
      >
        <img src={records} alt="records" className="nav-icon" />
        Records
      </Link>
      <Link
        to="/main/history"
        className={isCurrentLoc('history') ? 'nav-button-active' : 'nav-button'}
      >
        <img src={history_icon} alt="history" className="nav-icon" />
        History
      </Link>
      <Link
        to="/main/team"
        className={isCurrentLoc('team') ? 'nav-button-active' : 'nav-button'}
      >
        <img src={team_icon} alt="team" className="nav-icon" />
        Team
      </Link>
      <Link
        to="/main/add_member"
        className={
          isCurrentLoc('add_member') ? 'nav-button-active' : 'nav-button'
        }
      >
        <img src={add_user} alt="team" className="nav-icon" />
        Add Member
      </Link>
      <button type="submit" onClick={logout} className="old-button">
        <img src={logout_icon} alt="team" className="nav-icon" />
        Logout
      </button>
    </div>
  );
}
