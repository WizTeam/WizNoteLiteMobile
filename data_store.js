import store from './simple_store';
import api from './api';
import * as arrayUtils from './utils/array';

export { connect } from './simple_store';

export const KEYS = {
  USER_INFO: 'userInfo',
  SELECTED_TYPE: 'selectedType',
  STARRED_NOTES: 'starredNotes',
};

function compareNote(note1, note2) {
  return note1.modified - note2.modified;
}

function sortNotes(notes) {
  notes.sort(compareNote);
}

function handleNewNote(kbGuid, note) {
  const starredNotes = store.getData(KEYS.STARRED_NOTES);
  if (!Array.isArray(starredNotes)) {
    return;
  }
  if (note.starred) {
    arrayUtils.upsert(starredNotes, { guid: note.guid }, note);
    sortNotes(starredNotes);
  } else {
    arrayUtils.remove(starredNotes, { guid: note.guid });
  }
  store.setData(KEYS.STARRED_NOTES, starredNotes);
}

function handleApiEvents(userGuid, eventName, ...args) {
  console.log(`on ${eventName}`);
  if (userGuid !== api.userGuid) {
    console.log(`ignore event, not current user: sender is ${userGuid}, current is ${api.userGuid}`);
  }

  if (eventName === 'newNote') {
    const [kbGuid, note] = args;
    handleNewNote(kbGuid, note);
  } else if (eventName === 'userInfoChanged') {
    const [userInfo] = args;
    store.setData(KEYS.USER_INFO, userInfo);
  }
}

function setSelectedType(type) {
  store.setData(KEYS.SELECTED_TYPE, type);
  api.setUserSettings(api.userGuid, KEYS.SELECTED_TYPE, type);
}

async function initUser() {
  const selectedType = api.getUserSettings(api.userGuid, KEYS.SELECTED_TYPE, '#allNotes');
  setSelectedType(selectedType);
  //
  api.registerListener(api.userGuid, handleApiEvents);

  //
}

async function initStarredNotes() {
  console.log('init starred notes');
  const notes = await api.getAllNotes({ starred: true });
  sortNotes(notes);
  store.setData(KEYS.STARRED_NOTES, notes);
}

export default {
  initUser,
  //
  setSelectedType,
  //
  initStarredNotes,
};
