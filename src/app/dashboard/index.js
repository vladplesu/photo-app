// Main app
import 'bootstrap';
import '../../styles/main.scss';

import idb from '../indexedDB/index';

import { getParam } from '../helpers';

const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', event => {
  if (localStorage.token) {
    const res = idb.logoutUser(localStorage.token);
    res
      .then(res => {
        localStorage.removeItem('token');
        window.location.href = '/';
      })
      .catch(err => {
        console.log(err);
      });
  }
});

function handleFiles(files, collection) {
  // Loop through the FileList
  for (let i = 0, f; (f = files[i]); i++) {
    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    const img = document.createElement('img'),
      url = URL.createObjectURL(f);

    img.onload = () => URL.revokeObjectURL(url);
    img.src = url;

    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;

    const context = canvas.getContext('2d');
    context.drawImage(img, canvas.width, canvas.height);

    canvas.toBlob(async blob => {
      try {
        const photoID = await idb.addPhoto(f, blob);
        collection.ids_photos.push(photoID);
        collection.count++;
        await idb.updateColletion(collection);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

function addEventListeners() {
  window.addEventListener('load', async () => {
    if (localStorage.token) {
      const username = getParam('username');
      try {
        await idb.isUserLoggedIn(username);
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/';
        console.error(err);
      }
    } else {
      window.location.href = '/';
    }
  });

  $('#add-collection').on('click', async event => {
    event.preventDefault();
    event.stopPropagation();
    if (localStorage.token) {
      const username = getParam('username');
      try {
        await idb.isUserLoggedIn(username);
        const title = $('#album-title').get(0).value;
        if (title.length > 0) {
          try {
            const obj = await idb.addCollection(username, title);
            const files = $('#files').get(0).files;
            const $span = $('#date-created');
            const options = { day: 'numeric', month: 'short' };
            $span.text(obj.dateCreated.toLocaleDateString('ro-RO', options));
            handleFiles(files, obj);
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  $('#get-collections').on('click', async () => {
    if (localStorage.token) {
      const username = getParam('username');
      try {
        await idb.isUserLoggedIn(username);
        const collections = await idb.getCollectionIDs(username);
        collections.forEach(async id => {
          try {
            const title = await idb.getCollectionTitle(id);
            const p = document.createElement('p');
            p.innerText = title;
            document.body.appendChild(p);
          } catch (err) {
            console.error(err);
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  });
}

addEventListeners();
idb.openDb();
