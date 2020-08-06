const path = require('path');
const paths = require('../common/paths');

const fs = global.wizWrapper.fs;

async function getDefaultNoteHtml() {
  const htmlPath = path.join(paths.getResourcesPath(), 'default_note.html');
  const data = await fs.readFile(htmlPath);
  return data.toString('utf8');
}

module.exports = getDefaultNoteHtml;
