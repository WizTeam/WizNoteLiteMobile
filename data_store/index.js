import store from '../simple_store';
import api from '../api';
import { updateCategoryNotes, getCategoryNotes } from './category_notes';
import { getTags } from './tags';
import { isTablet } from '../utils/device';

export { connect } from '../simple_store';

export const KEYS = {
  USER_INFO: 'userInfo',
  CURRENT_KB: 'kbGuid',
  SELECTED_TYPE: 'selectedType',
  CATEGORY_NOTES: 'categoryNotes',
  CURRENT_NOTE: 'currentNote',
  USER_SETTING: 'userSetting',
  TAGS: 'tags',
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

async function handleTagsChanged(kbGuid) {
  const tags = await getTags(kbGuid);
  store.setData(KEYS.TAGS, tags);
}

function getUserSetting() {
  const EDITOR_DEFAULT_CONFIG = {
    fontFamily: 'Open Sans',
    fontSize: '16',
    lineHeight: '1.8',
    paragraphHeight: '20',
  };
  store.setData(KEYS.USER_SETTING, {
    editorConfig: api.getUserSettings(api.userGuid, 'editorConfig', EDITOR_DEFAULT_CONFIG),
    colorTheme: api.getUserSettings(api.userGuid, 'colorTheme', 'default'),
  });
}

async function setUserSettings(key, value) {
  await api.setUserSettings(api.userGuid, key, value);
  const userSetting = store.getData(KEYS.USER_SETTING);
  store.setData(KEYS.USER_SETTING, Object.assign({}, userSetting, { [key]: value }));
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
    console.log('user info changed');
    const [userInfo] = args;
    store.setData(KEYS.USER_INFO, userInfo);
  } else if (eventName === 'tagsChanged' || eventName === 'tagRenamed') {
    const [kbGuid] = args;
    handleTagsChanged(kbGuid);
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
  console.debug('set current kb', kbGuid);
}

function getCurrentKb() {
  return store.getData(KEYS.CURRENT_KB);
}

async function initUser() {
  //
  const kbGuid = api.personalKbGuid;
  store.setData(KEYS.USER_INFO, api.user);
  store.setData(KEYS.CURRENT_KB, kbGuid);
  console.debug('set current kb', kbGuid);
  //
  let selectedType = api.getUserSettings(api.userGuid, KEYS.SELECTED_TYPE, '#allNotes');
  if (selectedType === '#searchResult') {
    selectedType = '#allNotes';
  }
  setSelectedType(selectedType);
  //
  if (isTablet()) {
    const currentNoteGuid = api.getUserSettings(api.userGuid, 'selectedNoteGuid', '');
    if (currentNoteGuid) {
      //
      const note = await api.getNote(kbGuid, currentNoteGuid);
      if (note) {
        note.markdown = await api.getNoteMarkdown(kbGuid, note.guid);
        setCurrentNote(note);
      }
    }
  }
  //
  const tags = await getTags(kbGuid);
  store.setData(KEYS.TAGS, tags);
  //
  getUserSetting();
  //
  api.initEvents();
  api.registerListener(api.userGuid, handleApiEvents);

  api.syncData(kbGuid);
}

async function resetCategoryNotes(changeToSelectedType, callback) {
  let selectedType = store.getData(KEYS.SELECTED_TYPE) || '#allNotes';
  if (changeToSelectedType !== undefined) {
    selectedType = changeToSelectedType;
  }
  if (selectedType === '#searchResult') {
    return;
  }
  //
  const kbGuid = getCurrentKb();
  //
  const notes = await getCategoryNotes(kbGuid, selectedType);
  sortNotes(notes);
  store.setData(KEYS.CATEGORY_NOTES, notes, callback);
  //
  if (changeToSelectedType !== undefined) {
    setSelectedType(changeToSelectedType);
  }
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
  resetCategoryNotes,
  //
  setSearchResult,
  setUserSettings,
};
