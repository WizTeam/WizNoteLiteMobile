import store from '../simple_store';
import api from '../api';
import { updateCategoryNotes, getCategoryNotes } from './category_notes';
import { updateStarredNotes, getStarredNotes } from './starred_notes';

export { connect } from '../simple_store';

export const KEYS = {
  USER_INFO: 'userInfo',
  CURRENT_KB: 'kbGuid',
  SELECTED_TYPE: 'selectedType',
  CATEGORY_NOTES: 'categoryNotes',
  STARRED_NOTES: 'starredNotes',
  CURRENT_NOTE: 'currentNote',
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

function setCurrentNote(note) {
  store.setData(KEYS.CURRENT_NOTE, note);
  api.setUserSettings(api.userGuid, 'selectedNoteGuid', note?.guid);
}

function setCurrentKb(kbGuid) {
  store.setData(KEYS.CURRENT_KB, kbGuid);
}

async function initUser() {
  //
  store.setData(KEYS.USER_INFO, api.user);
  store.setData(KEYS.CURRENT_KB, api.user.kbGuid);
  //
  const selectedType = api.getUserSettings(api.userGuid, KEYS.SELECTED_TYPE, '#allNotes');
  setSelectedType(selectedType);
  //
  const currentNoteGuid = api.getUserSettings(api.userGuid, 'selectedNoteGuid', '');
  if (currentNoteGuid) {
    //
    const note = await api.getNote(null, currentNoteGuid);
    note.markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
    setCurrentNote(note);
  }
  //
  api.registerListener(api.userGuid, handleApiEvents);
  //
  api.syncData();
  setInterval(() => {
    api.syncData();
  }, 60 * 1000);
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
  setCurrentKb,
  //
  setSelectedType,
  setCurrentNote,
  //
  initCategoryNotes,
  initStarredNotes,
};
