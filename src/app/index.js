// Main app
import '../styles/foundation.scss';
import '../styles/main.scss';

import 'foundation-sites';

import 'what-input';

import * from './indexedDB';

$(document).foundation();

$('#new-user-form').on('formvalid.zf.abide', (ev, frm) => {
  // alert('form is valid');
  const userName = frm.find('input[type="text"').val();
  const password = frm.find('input[type="password"]').val();
  const confirmation = $('#confirmation').val();
  if (password === confirmation) {
    try {
      addUser(userName, password);
    } catch (err) {
      console.error(err);
    }
    // } else {
  }
});

$('#new-user-form').on('forminvalid.zf.abide', (ev, frm) => {
  console.log('form is invalid');
  console.log(ev);
  console.log(frm);
});

openDb();
