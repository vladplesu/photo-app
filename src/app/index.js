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
          }
          form.classList.add('was-validated');
        },
        false
      );
    },
    false
  );
});

const forgotPassBtn = document.querySelector('#log-in-form form p a');

forgotPassBtn.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#recover-form').classList.add('show');
  document.querySelector('#log-in-form').classList.add('hide');
});

const cancelBtn = document.querySelector(
  '#recover-form button.btn-outline-secondary'
);

cancelBtn.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#recover-form').classList.remove('show');
  document.querySelector('#log-in-form').classList.remove('hide');
});
