const assert = require('assert');
const users = require('./user/users');

assert(global.wizWrapper, 'wizWrapper must be initialized before using wiznote sdk');

(async () => {
  try {
    const allUsers = await users.getUsers()
    console.log(allUsers);
    //
    const user = await users.onlineLogin('as.wiz.cn', 'test_node@wiz.cn', '123456');
  } catch (err) {
    console.error(err);
  }

})();

const wizApi = {

}

module.exports = wizApi;
