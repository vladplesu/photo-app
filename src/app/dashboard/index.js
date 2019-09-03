// Main app
import 'bootstrap';
import '../../styles/main.scss';

import {
  logoutUser,
  openDb,
  getUserByToken,
  addCollection
} from '../indexedDB/index';

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

const logoutBtn = document.querySelector('button.btn-outline-secondary');
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

const newCollectionBtn = document.querySelector('button.btn-outline-primary');
newCollectionBtn.addEventListener('click', event => {
  if (localStorage.token) {
    const obj = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
      obj[key] = value;
    });

    addCollection(obj.username, 'My First Album');
  }
});

openDb();
