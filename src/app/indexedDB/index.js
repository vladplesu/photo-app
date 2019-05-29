(function() {
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
          keyPath: 'id',
          autoIncrement: true
        }
      );

      userStore.createIndex('username', 'username', { unique: true });

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
  function addUser(username, password) {
    console.log('addUser:', arguments);
    const obj = { username, password };

    const store = getObjectStore(DB_STORE_NAME[0], 'readwrite');
    const req = store.add(obj);
    req.onsuccess = function(evt) {
      console.log('Insertion in DB successful');
    };
    req.onerror = function() {
      console.error('addPublication error', this.error);
      displayActionFailure(this.error);
    };
  }

  function addEventListeners() {
    console.log('addEventListeners');
  }

  openDb();
  addEventListeners();
})(); // Immediately-Invoked Function Expression (IIFE)
