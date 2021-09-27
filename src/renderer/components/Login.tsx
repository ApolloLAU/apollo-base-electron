import React from 'react';
import icon from '../../../assets/FRSLogo.png';
import './Login.global.css';

export default function Login() {
  return (
    <div className="login">
      <div className="logo">
        <img width="294px" alt="icon" src={icon} />
      </div>
      <input id="field" type="text" />
      <input id="field" type="password" />
      <button className="login-button" type="submit">
        Log in
      </button>
    </div>
  );
}
