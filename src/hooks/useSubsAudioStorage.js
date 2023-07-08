import { openDatabase, SUBS_AUDIO_TABLE } from './openDatabase';

export function useSubsAudioStorage() {
  const saveSubAudio = async (id, audioBlob) => {
    const db = await openDatabase();
    const data = await db.get(SUBS_AUDIO_TABLE, id);
    if (data) {
      await db.delete(SUBS_AUDIO_TABLE, id);
    }

    await db.add(SUBS_AUDIO_TABLE, {
      id: id,
      audio: audioBlob,
    });
    db.close();
  };

  const loadSubAudio = async (id) => {
    const db = await openDatabase();
    const data = await db.get(SUBS_AUDIO_TABLE, id);
    db.close();
    return data ? URL.createObjectURL(data.audio) : null;
  };

  return { saveSubAudio, loadSubAudio };
}
