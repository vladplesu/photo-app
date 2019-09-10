// Main app
import 'bootstrap';
import '../styles/main.scss';

import idb from './indexedDB';
import addNewUser from './new-user';
import loginUser from './login';

function addEventListeners() {
  const recoverForm = document.querySelector('#recover-form');
  const $newUserForm = $('#new-user-form');
  const $loginForm = $('#log-in-form');

  addNewUser($newUserForm);

  loginUser($loginForm);

  window.addEventListener('load', async () => {
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
      try {
        const username = await idb.isUserLoggedIn();
        window.location.href = `/dashboard?username=${username}`;
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
      }
    }
  });

  $('button.btn-outline-secondary').on('click', event => {
    event.preventDefault();
    recoverForm.classList.remove('show');
    $newUserForm.removeClass('show');
    $loginForm.removeClass('hide left right');
    $newUserForm
      .children('form')
      .removeClass('was-validated')
      .trigger('reset');
  });

  $loginForm.find('p a:last-child').on('click', event => {
    event.preventDefault();
    $newUserForm.addClass('show');
    $loginForm.addClass('hide right');
    $loginForm.children('form').removeClass('was-validated');
    $loginForm.children('form').trigger('reset');
  });

  $loginForm.find('p a:first').on('click', event => {
    event.preventDefault();
    recoverForm.classList.add('show');
    $loginForm.addClass('hide left');
    $loginForm
      .children('form')
      .removeClass('was-validated')
      .trigger('reset');
  });
}

addEventListeners();

idb.openDb();
