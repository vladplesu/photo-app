// New user script
import { addUser } from './indexedDB';

const addNewUser = formContainer => {
  const loginForm = document.querySelector('#log-in-form');

  const newUserBtn = formContainer.querySelector('button[type="submit"]');
  newUserBtn.addEventListener('click', event => {
    const form = formContainer.querySelector('form');
    if (form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      const username = formContainer.querySelector('#new-user-input');
      const password = formContainer.querySelector('#new-password-input');
      const res = addUser(username.value, password.value);
      res
        .then(res => {
          console.log(res);
          formContainer.classList.remove('show');
          loginForm.classList.remove('hide', 'left', 'right'); // TODO:
          form.classList.remove('was-validated');
          form.reset();
        })
        .catch(err => {
          console.log(err);
          username.setCustomValidity('Username allready exists.');
        });
    }
  });

  const checkpass = formContainer.querySelector('#new-checkpass-input');
  const password = formContainer.querySelector('#new-password-input');
  const checkPassword = event => {
    if (event.target.value !== password.value) {
      checkpass.setCustomValidity('Passwords do not match.');
    } else {
      checkpass.setCustomValidity('');
    }
  };
  checkpass.addEventListener('keyup', checkPassword);
  checkpass.addEventListener('change', checkPassword);

  const username = formContainer.querySelector('#new-user-input');
  username.addEventListener('keydown', event => username.setCustomValidity(''));

  const showPass = formContainer.querySelector('#show-password2');
  showPass.addEventListener('click', () => {
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  });
};

export default addNewUser;
