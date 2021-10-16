import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import icon from '../../../../assets/FRSLogo.png';
import './css/Login.css';
import { API } from '../../api/API';

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

  const onClickLogin = (evt: FormEvent<HTMLFormElement>) => {
    // todo: FRONTEND - show error if form not filled
    evt.preventDefault();
    console.log(email, password);
    setLoginEnabled(false);
    if (email === 'admin' && password === 'admin') {
      // go to district creator!!
      console.log('pushing admin');
      setLoginEnabled(true);
      history.push('/admin');
    } else {
      API.login(email, password)
        .then((user) => {
          console.log('User Logged In');
          return API.getWorkerForUser(user);
        })
        .then(async (w) => {
          if (w.getRole() !== 'field_worker') {
            w.setStatus('online');
            await w.save();
          }
          return w.getRole();
        })
        .then((role) => {
          if (role === 'field_worker') {
            // todo: show role error
          } else if (role === 'base_worker') {
            setLoginEnabled(true);
            history.push('/main/mission');
          } else {
            setLoginEnabled(true);
            history.push('/main/team');
          }
        })
        .catch((error) => {
          console.log(error);
          setLoginEnabled(true);
          // todo: FRONTEND - Show Login Error
        });
    }
  };

  return (
    <form onSubmit={onClickLogin} className="login">
      <img width="294px" alt="icon" src={icon} className="logo-login" />
      <input id="field" type="text" value={email} onChange={onEmailChange} />
      <input
        id="field"
        type="password"
        value={password}
        onChange={onPassChange}
      />
      <button className="login-button" type="submit" disabled={!loginEnabled}>
        Log in
      </button>
    </form>
  );
}
