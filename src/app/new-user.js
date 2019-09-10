// New user script
import idb from './indexedDB';

function addNewUser($formContainer) {
  const $newUserBtn = $formContainer.find('button[type="submit"]');
  $newUserBtn.on('click', async event => {
    const $form = $formContainer.children('form');
    if ($form.get(0).checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      $form.addClass('was-validated');
      const username = $('#new-user-input').get(0);
      const password = $('#new-password-input').get(0).value;
      try {
        await idb.addUser(username.value, password);
        $formContainer.removeClass('show');
        $('#log-in-form').removeClass('hide left right');
        $form.removeClass('was-validated').trigger('reset');
      } catch (err) {
        console.error(err);
        username.setCustomValidity('Username allready exists.');
      }
    }
  });

  const password = document.getElementById('new-password-input');
  $('#new-checkpass-input').on('keyup change', event => {
    if (event.target.value !== password.value) {
      event.target.setCustomValidity('Passwords do not match.');
    } else {
      event.target.setCustomValidity('');
    }
  });

  $('#show-password2').on('click', () => {
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  });

  $('#new-user-input').on('keydown', event =>
    event.target.setCustomValidity('')
  );
}

export default addNewUser;
