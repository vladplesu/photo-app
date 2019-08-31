import uniqid from 'uniqid';

const DB_NAME = 'photo-app-demo';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = ['users', 'collections', 'photos'];

let db;

function openDb() {
  console.log('openDb ...');
  const req = indexedDB.open(DB_NAME, DB_VERSION);
  req.onsuccess = event => {
    db = event.target.result;
    console.log('openDb DONE');
  };
  req.onerror = event => {
    console.error('openDb:', event.target.errorCode);
  };

  req.onupgradeneeded = event => {
    console.log('openDb.onupgradeneeded');
    const userStore = event.currentTarget.result.createObjectStore(
      DB_STORE_NAME[0],
      {
        keyPath: 'id'
      }
    );

    userStore.createIndex('username', 'username', { unique: true });
    userStore.createIndex('password', 'password', { unique: false });
    userStore.createIndex('token', 'token', { unique: false });
    userStore.createIndex('ids_collections', 'ids_collections', {
      unique: false
    });

    const collectionStore = event.currentTarget.result.createObjectStore(
      DB_STORE_NAME[1],
      { keyPath: 'id', autoIncrement: true }
    );

    collectionStore.createIndex('userId', 'userId', { unique: false });
    collectionStore.createIndex('title', 'title', { unique: true });
    collectionStore.createIndex('dateCreated', 'dateCreated', {
      unique: false
    });

    const photoStore = event.currentTarget.result.createObjectStore(
      DB_STORE_NAME[2],
      { keyPath: 'id', autoIncrement: true }
    );

    photoStore.createIndex('collectionId', 'collectionId', { unique: false });
    photoStore.createIndex('name', 'name', { unique: true });
    photoStore.createIndex('dateCreated', 'dateCreated', { unique: false });
  };
}

/**
 * @param {string} store_name
 * @param {string} mode either "readonly" or "readwrite"
 */
function getObjectStore(store_name, mode) {
  var tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
}

/**
 * @param {string} username
 * @param {string} password
 */
const addUser = (username, password) => {
  return new Promise((resolve, reject) => {
    console.log('addUser:', arguments);
    const obj = {
      id: uniqid('userID-'),
      username,
      password,
      token: '',
      ids_collections: []
    };

    const store = getObjectStore(DB_STORE_NAME[0], 'readwrite');
    const req = store.add(obj);
    req.onsuccess = function(evt) {
      resolve('Insertion in DB successful');
    };
    req.onerror = function() {
      reject(`addUser error: ${this.error.message}`);
    };
  });
};

const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[0], 'readwrite');

    let req = store.openCursor();
    req.onsuccess = event => {
      const cursor = event.target.result;

      if (cursor) {
        req = store.get(cursor.key);
        req.onsuccess = event => {
          const data = event.target.result;
          if (data.username === username && data.password === password) {
            localStorage.setItem('token', uniqid('token-'));
            data.token = localStorage.token;
            store.put(data);
            resolve({ msg: 'Username exists!', token: data.token });
          } else {
            reject('Incorect username or password. Pleas try again.');
          }
        };

        cursor.continue();
      } else {
        reject('Username does not exist. Create a new user.');
      }
    };
  });
};

const getUserByToken = token => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[0], 'readonly');

    let req = store.openCursor();
    req.onsuccess = event => {
      const cursor = event.target.result;

      if (cursor) {
        req = store.get(cursor.key);
        req.onsuccess = event => {
          const data = event.target.result;
          if (data.token === token) {
            resolve('User is still logedin');
          }
          cursor.continue();
        };
      } else {
        reject('Token not found');
      }
    };
  });
};

const logoutUser = token => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[0], 'readwrite');

    let req = store.openCursor();
    req.onsuccess = event => {
      const cursor = event.target.result;

      if (cursor) {
        req = store.get(cursor.key);
        req.onsuccess = event => {
          const data = event.target.result;
          if (data.token === token) {
            data.token = '';
            store.put(data);
            resolve('User logged out successfuly');
          }
        };
      } else {
        reject('Token not found');
      }
    };
  });
};

function addEventListeners() {
  console.log('addEventListeners');

  $('#log-in').on('click', async event => {
    // event.preventDefault();
    const userName = $('#username').value;
    const password = $('input[type="password"]');
    try {
      const res = await getUser(userName, password);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  });
}

export { openDb, addUser, getUser, getUserByToken, logoutUser };
