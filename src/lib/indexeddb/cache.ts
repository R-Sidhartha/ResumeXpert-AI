import { openDB } from "idb";

const DB_NAME = "resume-thumbnail-cache";
const STORE_NAME = "thumbnails";

export const getThumbnailFromCache = async (
  resumeId: string,
): Promise<string | undefined> => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return await db.get(STORE_NAME, resumeId);
};

export const storeThumbnailInCache = async (
  resumeId: string,
  dataUrl: string,
) => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  await db.put(STORE_NAME, dataUrl, resumeId);
};
