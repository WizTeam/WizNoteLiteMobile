import store from './simple_store';
import api from './api';

export { connect } from './simple_store';

export const KEYS = {
  SELECTED_TYPE: 'selectedType',
};

function setSelectedType(type) {
  store.setData(KEYS.SELECTED_TYPE, type);
  api.setUserSettings(api.userGuid, KEYS.SELECTED_TYPE, type);
}

async function initUser() {
  const selectedType = api.getUserSettings(api.userGuid, KEYS.SELECTED_TYPE, '#allNotes');
  setSelectedType(selectedType);
}

export default {
  initUser,
  setSelectedType,
};
