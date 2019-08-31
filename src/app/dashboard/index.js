// Main app
import 'bootstrap';
import '../../styles/main.scss';

import { logoutUser, openDb } from '../indexedDB/index';

window.addEventListener('load', () => {
  if (localStorage.token) {
    const res = getUserByToken(localStorage.token);
    res
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  } else {
    window.location.href = '/';
  }
});

const logoutBtn = document.querySelector('button');
logoutBtn.addEventListener('click', event => {
  if (localStorage.token) {
    const res = logoutUser(localStorage.token);
    res
      .then(res => {
        localStorage.removeItem('token');
        window.location.href = '/';
      })
      .catch(err => {
        console.log(err);
      });
  }
});

openDb();
