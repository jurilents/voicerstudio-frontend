import { openDB } from 'idb';

const DB_NAME = 'voicerDB';
const TABLE_NAME = 'videos';

export function useVideoStorage() {
  const openDatabase = async () => {
    return await openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(TABLE_NAME, { keyPath: 'id' });
      },
    });
  };

  const saveVideo = async (id, videoBlob) => {
    const db = await openDatabase();
    await db.add('videos', {
      id: id,
      video: videoBlob,
    });
  };

  const loadVideo = async (id) => {
    const db = await openDatabase();
    const data = await db.get(TABLE_NAME, id);
    return data ? URL.createObjectURL(data.video) : null;
  };

  return { saveVideo, loadVideo };
}
