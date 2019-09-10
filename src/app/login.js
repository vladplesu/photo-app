// Login script
import idb from './indexedDB';

function loginUser($formContainer) {
  const $loginBtn = $formContainer.find('button[type="submit"]');
  $loginBtn.on('click', async event => {
    const $form = $formContainer.children('form');
    if ($form.get(0).checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      $form.addClass('was-validated');
      const username = $('#login-user-input').get(0);
      const password = $('#login-pass-input').get(0);
      try {
        await idb.getUser(username.value, password.value);
        $form.submit();
      } catch (err) {
        console.error(err);
        username.setCustomValidity(err);
        password.setCustomValidity(err);
      }
    }
  });

  $('#login-user-input, #login-pass-input').on('keyup', event => {
    if (!event.target.checkValidity()) event.target.setCustomValidity('');
  });

  $('#show-password1').on('click', () => {
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  });
}

export default loginUser;
