import { useIndexedDB, VIDEOS_TABLE } from './useIndexedDB';

export function useVideoStorage() {
  const { openDatabase } = useIndexedDB();

  const saveVideo = async (id, videoBlob) => {
    const db = await openDatabase();
    const data = await db.get(VIDEOS_TABLE, id);
    if (data) {
      await db.delete(VIDEOS_TABLE, id);
    }

    await db.add(VIDEOS_TABLE, {
      id: id,
      video: videoBlob,
    });
  };

  const loadVideo = async (id) => {
    const db = await openDatabase();
    const data = await db.get(VIDEOS_TABLE, id);
    return data ? URL.createObjectURL(data.video) : null;
  };

  return { saveVideo, loadVideo };
}
