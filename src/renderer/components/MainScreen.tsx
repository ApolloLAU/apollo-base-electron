import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import NavigationMenu from './subcomponents/NavigationMenu';
import { API } from '../api/API';
import TeamScreen from './navscreens/TeamScreen';
import OperatorScreen from './subscreens/OperatorScreen';
import HistoryScreen from './navscreens/HistoryScreen';
import PastMissionScreen from './subscreens/PastMissionScreen';
import AddMemberScreen from './navscreens/AddMemberScreen';
import CurrentMissionScreen from './navscreens/CurrentMissionScreen';
import DispatchScreen from './navscreens/DispatchScreen';

import './css/MainScreen.css';

import placeholder from '../../../assets/empty-profile-picture.png';

export default function MainScreen() {
  const history = useHistory();
  const location = useLocation();
  const [role, setRole] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const getHeader = () => {
    const url = location.pathname;
    if (url.includes('mission')) {
      return 'Active Mission';
    }
    if (url.includes('dispatch')) {
      return 'Dispatch';
    }
    if (url.includes('records')) {
      return 'Patient Records';
    }
    if (url.includes('history')) {
      return 'Mission History';
    }
    if (url.includes('team')) {
      return 'Team Records';
    }
    return 'Add Team Member';
  };

  useEffect(() => {
    console.log('USE EFFECT CALLED!!');
    const user = API.getLoggedInUser();
    console.log(location.pathname);
    if (user) {
      API.getWorkerForUser(user).then((r) => {
        setRole(r.getRole());
        setImgUrl(r.getImgURL());
      });
    } else if (location.pathname !== '/admin') history.push('/');
  }, [location]);

  let finalImg = imgUrl !== '' ? imgUrl : placeholder;

  return (
    <div className="main-div">
      <NavigationMenu role={role} />
      <div className="content-area">
        <div className="header">
          <h1 className="header-title">{getHeader()}</h1>
          <div className="profile-area">
            <span className="logged-in-area">
              Logged in as
              <br />
              <span className="profile-name">Peter Sakr</span>
            </span>
            <img src={finalImg} alt="profile" className="profile-pic" />
          </div>
        </div>
        <Switch>
          <Route path="/main/team/:id" component={OperatorScreen} />
          <Route path="/main/team" component={TeamScreen} />
          <Route path="/main/history/:id" component={PastMissionScreen} />
          <Route path="/main/history" component={HistoryScreen} />
          <Route path="/main/add_member" component={AddMemberScreen} />
          <Route path="/main/mission" component={CurrentMissionScreen} />
          <Route path="/main/dispatch" component={DispatchScreen} />
        </Switch>
      </div>
    </div>
  );
}
