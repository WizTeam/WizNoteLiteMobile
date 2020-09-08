/* eslint-disable no-param-reassign */
import api from '../api';

export async function getTags() {
  function convertTags(tagsData, currentTag, object) {
    for (const [key, value] of Object.entries(object)) {
      if (key === 'wizName') {
        if (!currentTag.name === value) {
          console.error(`invalid tags data, invalid name: ${value}, data: ${JSON.stringify(tagsData)}`);
        }
        currentTag.name = value;
      } else if (key === 'wizFull') {
        currentTag.id = value;
      } else {
        const childTag = {
          name: key,
          children: [],
        };
        convertTags(tagsData, childTag, value);
        if (!childTag.id) {
          console.error(`invalid tags data, no tag path: ${key}, data: ${JSON.stringify(tagsData)}`);
        }
        currentTag.children.push(childTag);
      }
    }
  }
  try {
    const tagsData = await api.getAllTags();
    const root = {
      children: [],
    };
    convertTags(tagsData, root, tagsData);
    return root.children;
  } catch (err) {
    console.error(err);
    return [];
  }
}
