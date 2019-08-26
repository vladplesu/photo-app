// Main app
import 'bootstrap';
import '../styles/main.scss';

import { openDb } from './indexedDB';
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
});

const recoverForm = document.querySelector('#recover-form');
const newUserForm = document.querySelector('#new-user-form');
const loginForm = document.querySelector('#log-in-form');

const forgotPassBtn = loginForm.querySelector('p a');

forgotPassBtn.addEventListener('click', event => {
  event.preventDefault();
  recoverForm.classList.add('show');
  loginForm.classList.add('hide', 'left');
});

const createUserBtn = loginForm.querySelector('p a:last-child');

createUserBtn.addEventListener('click', event => {
  event.preventDefault();
  newUserForm.classList.add('show');
  loginForm.classList.add('hide', 'right');
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

// loginForm.querySelector('form').addEventListener('submit', event => {
//   event.preventDefault();
//   event.stopPropagation();
//   console.log(event);
// });
