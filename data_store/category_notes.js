import * as arrayUtils from '../utils/array';
import api from '../api';

export function updateCategoryNotes(allNotes, note, selectedType) {
  let accept = false;
  //
  if (selectedType === '#allNotes') {
    accept = !note.trash;
  } else if (selectedType === '#trash') {
    accept = note.trash;
  } else {
    accept = note.tags.toLowerCase().indexOf(selectedType) !== -1;
  }
  //
  if (accept) {
    arrayUtils.upsert(allNotes, { guid: note.guid }, note);
  } else {
    arrayUtils.remove(allNotes, { guid: note.guid });
  }
}

export async function getCategoryNotes(selectedType) {
  const options = {};
  if (selectedType === '#allNotes') {
    //
  } else if (selectedType === '#trash') {
    options.trash = true;
  } else {
    options.tags = selectedType;
  }
  //
  const allNotes = await api.getAllNotes(null, options);
  return allNotes;
}
