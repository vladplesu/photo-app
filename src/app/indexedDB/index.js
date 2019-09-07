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
      { keyPath: 'id' }
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

    photoStore.createIndex('collectionID', 'collectionID', { unique: false });
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

const addCollection = (username, title) => {
  return new Promise((resolve, reject) => {
    const userStore = getObjectStore(DB_STORE_NAME[0], 'readwrite');
    const index = userStore.index('username');
    const req = index.get(username);
    req.onsuccess = event => {
      const data = event.target.result;
      if (typeof data === 'undefined') return reject('No user logedin');

      const obj = {
        id: uniqid('col-'),
        userId: data.id,
        ids_photos: [],
        title: title,
        dateCreated: new Date(),
        count: 0
      };
      data.ids_collections.push(obj.id);
      userStore.put(data);
      const store = getObjectStore(DB_STORE_NAME[1], 'readwrite');
      const req = store.add(obj);
      req.onsuccess = () => {
        resolve(obj);
      };
      req.onerror = event => {
        userStore.transaction.abort();
        reject(`addCollection: ${event.target.error}`);
      };
    };
  });
};

const updateColletion = obj => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[1], 'readwrite');
    const req = store.put(obj);
    req.onsuccess = () => resolve('Store updated successfuly');
    req.onerror = event => reject(`updateCollection: ${event.target.error}`);
  });
};

const addPhoto = (f, blob, collectionID) => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[2], 'readwrite');
    const obj = {
      id: uniqid('img-'),
      collectionID,
      thumb: blob,
      photo: f,
      name: f.name,
      dateCreated: new Date()
    };
    const req = store.add(obj);
    req.onsuccess = () => {
      resolve(obj.id);
    };
    req.onerror = event => {
      reject(`addPhoto: ${event.target.error}`);
    };
  });
};

const getCollectionIDs = username => {
  return new Promise((resolve, reject) => {
    const userStore = getObjectStore(DB_STORE_NAME[0], 'readwrite');
    const index = userStore.index('username');
    const req = index.get(username);
    req.onsuccess = event => {
      const data = event.target.result;
      if (typeof data === 'undefined') return reject('No user logedin');

      resolve(data.ids_collections);
    };
    req.onerror = event => {
      console.log(`getCollection: ${event.target.error}`);
    };
  });
};

const getCollectionTitle = id => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[1], 'readwrite');
    const req = store.get(id);
    req.onsuccess = event => {
      const data = event.target.result;
      resolve(data.title);
    };
    req.onerror = event => {
      console.log(`getCollectionTitle: ${event.target.error}`);
    };
  });
};

const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[0], 'readwrite');
    const index = store.index('username');

    let req = index.get(username);
    req.onsuccess = event => {
      const data = event.target.result;
      if (typeof data === 'undefined')
        return reject('Username does not exist. Create a new user.');
      if (data.username === username && data.password === password) {
        localStorage.setItem('token', uniqid('token-'));
        data.token = localStorage.token;
        store.put(data);
        resolve({ msg: 'Username exists!', token: data.token });
      }
    };
    req.onerror = event => {
      reject('User not found: ' + event.target.errorCode);
    };
  });
};

const isUserLoggedIn = (username = null) => {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(DB_STORE_NAME[0], 'readonly');
    const index = store.index(username === null ? 'token' : 'username');

    let req = index.get(username === null ? localStorage.token : username);
    req.onsuccess = event => {
      const data = event.target.result;
      if (typeof data === 'undefined') return reject('Username not found');

      if (localStorage.token === data.token) {
        resolve(true);
      } else {
        reject('User not logged in');
      }
    };
    req.onerror = event => {
      reject(`Username not found: ${event.target.errorCode}`);
    };
  });
};

/**
 *
 *
 * @param {*} token
 * @returns
 */
function logoutUser(token) {
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
}

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

export default {
  openDb,
  addUser,
  getUser,
  isUserLoggedIn,
  logoutUser,
  addCollection,
  addPhoto,
  getCollectionIDs,
  getCollectionTitle,
  updateColletion
};
