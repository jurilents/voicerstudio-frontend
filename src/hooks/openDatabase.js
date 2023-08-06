import { deleteDB, openDB } from 'idb';

const DB_NAME = 'voicerDB';
export const VIDEOS_TABLE = 'videos';
export const SUBS_AUDIO_TABLE = 'subs_audio';
// export const HISTORY_TABLE = 'history';
// export const HISTORY_FUTURE_TABLE = 'future';

export const openDatabase = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(VIDEOS_TABLE, { keyPath: 'id' });
      db.createObjectStore(SUBS_AUDIO_TABLE, { keyPath: 'id' });
      // db.createObjectStore(HISTORY_TABLE, { keyPath: 'id', autoIncrement: true });
      // db.createObjectStore(HISTORY_FUTURE_TABLE, { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const dropDatabase = async () => {
  await deleteDB(DB_NAME);
};
