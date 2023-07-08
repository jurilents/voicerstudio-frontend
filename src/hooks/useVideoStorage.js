import { openDatabase, VIDEOS_TABLE } from './openDatabase';

export function useVideoStorage() {
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
    db.close();
  };

  const loadVideo = async (id) => {
    const db = await openDatabase();
    const data = await db.get(VIDEOS_TABLE, id);
    db.close();
    return data ? URL.createObjectURL(data.video) : null;
  };

  return { saveVideo, loadVideo };
}
