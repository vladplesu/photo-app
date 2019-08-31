// Main app
import 'bootstrap';
import '../styles/main.scss';

import { openDb, getUserByToken } from './indexedDB';
import addNewUser from './new-user';
import loginUser from './login';

window.addEventListener('load', () => {
  const $forms = $('.needs-validation');
  const validation = Array.prototype.filter.call(
    $forms,
    form => {
      form.addEventListener(
        'submit',
        event => {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log('invalid form');
          }
          form.classList.add('was-validated');
        },
        false
      );
    },
    false
  );

  if (localStorage.token) {
    const res = getUserByToken(localStorage.token);
    res
      .then(res => {
        window.location.href = '/dashboard';
      })
      .catch(err => {
        console.log(err);
        localStorage.removeItem('token');
      });
  }
});

const recoverForm = document.querySelector('#recover-form');
const newUserForm = document.querySelector('#new-user-form');
const loginForm = document.querySelector('#log-in-form');

const forgotPassBtn = loginForm.querySelector('p a');

forgotPassBtn.addEventListener('click', event => {
  event.preventDefault();
  recoverForm.classList.add('show');
  loginForm.classList.add('hide', 'left');
  loginForm.firstElementChild.classList.remove('was-validated');
  loginForm.firstElementChild.reset();
});

const createUserBtn = loginForm.querySelector('p a:last-child');

createUserBtn.addEventListener('click', event => {
  event.preventDefault();
  newUserForm.classList.add('show');
  loginForm.classList.add('hide', 'right');
  loginForm.firstElementChild.classList.remove('was-validated');
  loginForm.firstElementChild.reset();
});

const cancelBtns = document.querySelectorAll('button.btn-outline-secondary');

cancelBtns.forEach(btn => {
  btn.addEventListener('click', event => {
    event.preventDefault();
    console.log(event);
    recoverForm.classList.remove('show');
    newUserForm.classList.remove('show');
    loginForm.classList.remove('hide', 'left', 'right');
    newUserForm.firstElementChild.classList.remove('was-validated');
    newUserForm.firstElementChild.reset();
  });
});

openDb();

addNewUser(newUserForm);
loginUser(loginForm);
