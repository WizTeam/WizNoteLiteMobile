import store from '../simple_store';
import api from '../api';
import { updateCategoryNotes, getCategoryNotes } from './category_notes';

export { connect } from '../simple_store';

export const KEYS = {
  USER_INFO: 'userInfo',
  CURRENT_KB: 'kbGuid',
  SELECTED_TYPE: 'selectedType',
  CATEGORY_NOTES: 'categoryNotes',
  CURRENT_NOTE: 'currentNote',
};

function compareNote(note1, note2) {
  return note2.modified - note1.modified;
}

function sortNotes(notes) {
  notes.sort(compareNote);
}

function handleDownloadNotes(kbGuid, notes) {
  const categoryNotes = store.getData(KEYS.CATEGORY_NOTES);
  const shouldUpdateCategoryNotes = Array.isArray(categoryNotes);
  //
  const selectedType = store.getData(KEYS.SELECTED_TYPE);
  //
  notes.forEach((note) => {
    if (shouldUpdateCategoryNotes) {
      updateCategoryNotes(categoryNotes, note, selectedType);
    }
  });
  //
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
function getSelectedType() {
  return store.getData(KEYS.SELECTED_TYPE);
}

function setSelectedType(type) {
  store.setData(KEYS.SELECTED_TYPE, type);
  api.setUserSettings(api.userGuid, KEYS.SELECTED_TYPE, type);
}

function setCurrentNote(note) {
  store.setData(KEYS.CURRENT_NOTE, note);
  api.setUserSettings(api.userGuid, 'selectedNoteGuid', note?.guid);
}

function getCurrentNote() {
  return store.getData(KEYS.CURRENT_NOTE);
}

function setCurrentKb(kbGuid) {
  store.setData(KEYS.CURRENT_KB, kbGuid);
  console.log('set current kb', kbGuid);
}

function getCurrentKb() {
  return store.getData(KEYS.CURRENT_KB);
}

async function initUser() {
  //
  const kbGuid = api.user.kbGuid;
  store.setData(KEYS.USER_INFO, api.user);
  store.setData(KEYS.CURRENT_KB, kbGuid);
  console.log('set current kb', kbGuid);
  //
  const selectedType = api.getUserSettings(api.userGuid, KEYS.SELECTED_TYPE, '#allNotes');
  setSelectedType(selectedType);
  //
  const currentNoteGuid = api.getUserSettings(api.userGuid, 'selectedNoteGuid', '');
  if (currentNoteGuid) {
    //
    const note = await api.getNote(null, currentNoteGuid);
    if (note) {
      note.markdown = await api.getNoteMarkdown(kbGuid, note.guid);
      setCurrentNote(note);
    }
  }
  //
  api.initEvents();
  api.registerListener(api.userGuid, handleApiEvents);
  //
  api.syncData();
}

async function initCategoryNotes() {
  const selectedType = store.getData(KEYS.SELECTED_TYPE) || '#allNotes';
  const notes = await getCategoryNotes(selectedType);
  sortNotes(notes);
  store.setData(KEYS.CATEGORY_NOTES, notes);
}

function setSearchResult(notes) {
  setSelectedType('#searchResult');
  store.setData(KEYS.CATEGORY_NOTES, notes);
}

function logout() {
  api.logout();
}

export default {
  //
  logout,
  //
  initUser,
  setCurrentKb,
  getCurrentKb,
  //
  getSelectedType,
  setSelectedType,
  setCurrentNote,
  getCurrentNote,
  //
  initCategoryNotes,
  //
  setSearchResult,
};
