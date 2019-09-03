// Login script
import { getUser } from './indexedDB';

const loginUser = formContainer => {
  const loginBtn = formContainer.querySelector('button[type="submit"]');
  loginBtn.addEventListener('click', event => {
    const form = formContainer.querySelector('form');
    if (form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      const username = form.querySelector('#login-user-input');
      const password = form.querySelector('#login-pass-input');
      const res = getUser(username.value, password.value);
      res
        .then(res => {
          console.log(form);
          form.submit();
        })
        .catch(err => {
          console.log(err);
          username.setCustomValidity(err);
          password.setCustomValidity(err);
        });
    }
  });

  const username = formContainer.querySelector('#login-user-input');
  const password = formContainer.querySelector('#login-pass-input');
  const check = event => {
    if (!event.target.checkValidity()) event.target.setCustomValidity('');
  };
  username.addEventListener('keyup', check);
  password.addEventListener('keyup', check);

  const showPass = formContainer.querySelector('#show-password1');
  showPass.addEventListener('click', () => {
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  });
};

export default loginUser;
