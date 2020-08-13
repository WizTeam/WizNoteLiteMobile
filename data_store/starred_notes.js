import * as arrayUtils from '../utils/array';
import api from '../api';

export function updateStarredNotes(starredNotes, note) {
  if (note.starred && !note.trash) {
    arrayUtils.upsert(starredNotes, { guid: note.guid }, note);
  } else {
    arrayUtils.remove(starredNotes, { guid: note.guid });
  }
}

export async function getStarredNotes() {
  const notes = await api.getAllNotes({ starred: true });
  return notes;
}
