// Main app
import 'bootstrap';
import '../../styles/main.scss';

import idb from '../indexedDB/index';

import { getParam } from '../helpers';

function handleFiles(files, collection) {
  // Loop through the FileList
  for (let i = 0, f; (f = files[i]); i++) {
    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 200;

    const context = canvas.getContext('2d');

    const img = document.createElement('img'),
      url = URL.createObjectURL(f);

    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.body.appendChild(canvas);
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
      URL.revokeObjectURL(url);
    };
    img.src = url;
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

  $('#logout').on('click', async event => {
    if (localStorage.token) {
      try {
        await idb.logoutUser(localStorage.token);
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch (err) {
        console.error(err);
      }
    }
  });

  $('#add-collection').on('click', async event => {
    event.preventDefault();
    event.stopPropagation();
    if (localStorage.token) {
      const username = getParam('username');
      try {
        const userData = await idb.isUserLoggedIn(username);
        const title = $('#album-title').get(0).value;
        if (title.length > 0) {
          const collection = await idb.addCollection(userData.userId, title);
          const $span = $('#date-created');
          const options = { day: 'numeric', month: 'short' };
          $span.text(
            collection.dateCreated.toLocaleDateString('ro-RO', options)
          );
          const files = $('#files').get(0).files;
          if (files.length > 0) {
            handleFiles(files, collection);
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
          const col = await idb.getCollection(id);
          const ul = document.createElement('ul');
          const tArea = document.createElement('textarea');
          tArea.dataset.id = col.id;
          tArea.innerText = col.title;
          tArea.addEventListener('change', async event => {
            const elem = event.target;
            const col = await idb.getCollection(elem.dataset.id);
            col.title = elem.value;
            idb.updateColletion(col);
          });
          ul.appendChild(tArea);
          col.ids_photos.forEach(async id => {
            const imgData = await idb.getPhoto(id);
            const li = document.createElement('li');
            const img = document.createElement('img'),
              url = URL.createObjectURL(imgData.thumb);

            img.onload = () => URL.revokeObjectURL(url);
            img.src = url;
            li.appendChild(img);
            ul.appendChild(li);
          });
          document.body.appendChild(ul);
        });
      } catch (err) {
        console.error(err);
      }
    }
  });
}

addEventListeners();
idb.openDb();
