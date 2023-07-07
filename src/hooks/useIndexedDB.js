import { openDB } from 'idb';

const DB_NAME = 'voicerDB';
export const VIDEOS_TABLE = 'videos';
export const SUBS_AUDIO_TABLE = 'subs_audio';

export function useIndexedDB() {
  const openDatabase = async () => {
    return await openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(VIDEOS_TABLE, { keyPath: 'id' });
        db.createObjectStore(SUBS_AUDIO_TABLE, { keyPath: 'id' });
      },
    });
  };

  return { openDatabase };
}
