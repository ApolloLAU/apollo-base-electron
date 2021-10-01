import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router';
import icon from '../../../assets/FRSLogo.png';
import './Login.global.css';
import API from '../api/API';

export default function Login() {
  const history = useHistory();

  const [email, setEmail] = useState('petersakr.base');
  const [password, setPassword] = useState('test123');
  const [loginEnabled, setLoginEnabled] = useState(true);

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onPassChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onClickLogin = () => {
    // todo: FRONTEND - show error if form not filled
    setLoginEnabled(false);
    API.login(email, password)
      .then((user) => {
        console.log(user);
        return API.getRoleForUser(user);
      })
      .then((role) => {
        if (role === 'field_worker') {
          // todo: show role error
        } else if (role === 'base_worker') {
          history.push('/main/mission');
        } else {
          history.push('/main/team');
        }
        setLoginEnabled(true);
      })
      .catch((error) => {
        console.log(error);
        setLoginEnabled(true);
        // todo: FRONTEND - Show Login Error
      });
  };

  return (
    <div className="login">
      <div className="logo">
        <img width="294px" alt="icon" src={icon} />
      </div>
      <input id="field" type="text" value={email} onChange={onEmailChange} />
      <input
        id="field"
        type="password"
        value={password}
        onChange={onPassChange}
      />
      <button
        className="login-button"
        type="submit"
        onClick={onClickLogin}
        disabled={!loginEnabled}
      >
        Log in
      </button>
    </div>
  );
}
