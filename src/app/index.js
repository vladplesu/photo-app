// Main app
import 'bootstrap';
import '../styles/main.scss';

import { addUser, openDb } from './indexedDB';

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
    recoverForm.classList.remove('show');
    newUserForm.classList.remove('show');
    loginForm.classList.remove('hide', 'left', 'right');
  });
});

const newUserBtn = newUserForm.querySelector('button[type="submit"]');
newUserBtn.addEventListener('click', event => {
  const form = newUserForm.querySelector('form');
  if (form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
    const $username = $('#new-user-input');
    const $password = $('#new-password-input');
    const res = addUser($username[0].value, $password[0].value);
    res.then(res => console.log(res)).catch(err => console.log(err));
  }
});

const checkpass = document.querySelector('#new-checkpass-input');
const password = document.querySelector('#new-password-input');
const checkPassword = event => {
  if (event.target.value !== password.value) {
    checkpass.setCustomValidity('Passwords do not match.');
  } else {
    checkpass.setCustomValidity('');
  }
};
checkpass.addEventListener('keyup', checkPassword);
checkpass.addEventListener('change', checkPassword);

openDb();
