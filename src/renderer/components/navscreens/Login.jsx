import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import icon from '../../../../assets/apollo-full.png';
import styles from './css/Login.module.css';
import { API } from '../../api/API';

export default function Login() {
  const history = useHistory();

  const [email, setEmail] = useState('petersakr.base');
  const [password, setPassword] = useState('test123');
  const [loginEnabled, setLoginEnabled] = useState(true);

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPassChange = (event) => {
    setPassword(event.target.value);
  };

  const onClickLogin = (evt) => {
    // todo: FRONTEND - show error if form not filled
    evt.preventDefault();
    console.log(email, password);
    setLoginEnabled(false);
    API.logOut().then(() => {
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
            if (w) {
              if (w.getRole() !== 'field_worker') {
                w.setStatus('online');
                await w.save();
              }
              return w.getRole();
            }
            throw new Error('Could not find worker');
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
    });
  };

  return (
    <form onSubmit={onClickLogin} className={styles.login}>
      <img width="294px" alt="icon" src={icon} className={styles.logoLogin} />
      <input
        className={styles.loginField}
        type="text"
        value={email}
        onChange={onEmailChange}
      />
      <input
        className={styles.loginField}
        type="password"
        value={password}
        onChange={onPassChange}
      />
      <button
        className={styles.loginButton}
        type="submit"
        disabled={!loginEnabled}
      >
        Log in
      </button>
    </form>
  );
}
