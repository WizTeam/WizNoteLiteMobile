import store from '../simple_store';
import api from '../api';
import { updateCategoryNotes, getCategoryNotes } from './category_notes';
import { updateStarredNotes, getStarredNotes } from './starred_notes';

export { connect } from '../simple_store';

export const KEYS = {
  USER_INFO: 'userInfo',
  SELECTED_TYPE: 'selectedType',
  CATEGORY_NOTES: 'categoryNotes',
  STARRED_NOTES: 'starredNotes',
};

function compareNote(note1, note2) {
  return note2.modified - note1.modified;
}

function sortNotes(notes) {
  notes.sort(compareNote);
}

function handleDownloadNotes(kbGuid, notes) {
  const starredNotes = store.getData(KEYS.STARRED_NOTES);
  const shouldUpdateStarredNotes = Array.isArray(starredNotes);
  const categoryNotes = store.getData(KEYS.CATEGORY_NOTES);
  const shouldUpdateCategoryNotes = Array.isArray(categoryNotes);
  //
  const selectedType = store.getData(KEYS.SELECTED_TYPE);
  //
  notes.forEach((note) => {
    if (shouldUpdateStarredNotes) {
      updateStarredNotes(starredNotes, note);
    }
    if (shouldUpdateCategoryNotes) {
      updateCategoryNotes(categoryNotes, note, selectedType);
    }
  });
  //
  if (shouldUpdateStarredNotes) {
    sortNotes(starredNotes);
    store.setData(KEYS.STARRED_NOTES, starredNotes);
  }
  if (shouldUpdateCategoryNotes) {
    sortNotes(categoryNotes);
    store.setData(KEYS.CATEGORY_NOTES, categoryNotes);
  }
}

function handleNewNote(kbGuid, note) {
  handleDownloadNotes(kbGuid, [note]);
}

function handleModifyNote(kbGuid, note) {
  handleDownloadNotes(kbGuid, [note]);
}

function handleApiEvents(userGuid, eventName, ...args) {
  if (userGuid !== api.userGuid) {
    console.log(`ignore event, not current user: sender is ${userGuid}, current is ${api.userGuid}`);
  }

  if (eventName === 'newNote') {
    const [kbGuid, note] = args;
    handleNewNote(kbGuid, note);
  } else if (eventName === 'modifyNote') {
    const [kbGuid, note] = args;
    handleModifyNote(kbGuid, note);
  } else if (eventName === 'downloadNotes') {
    const [kbGuid, notes] = args;
    handleDownloadNotes(kbGuid, notes);
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
  setInterval(() => {
    // api.syncData();
  }, 10 * 1000);
  //
}

async function initCategoryNotes() {
  const selectedType = store.getData(KEYS.SELECTED_TYPE) || '#allNotes';
  const notes = await getCategoryNotes(selectedType);
  sortNotes(notes);
  store.setData(KEYS.CATEGORY_NOTES, notes);
}

async function initStarredNotes() {
  const notes = await getStarredNotes();
  sortNotes(notes);
  store.setData(KEYS.STARRED_NOTES, notes);
}

export default {
  initUser,
  //
  setSelectedType,
  //
  initCategoryNotes,
  initStarredNotes,
};
