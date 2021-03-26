function log(endpoint, func, username, message) {
  usernameLog = username? `user: ${username}`: '';
  console.log(`
    ---------------------------
    timestamp: ${Date.now()}
    ${endpoint}
    function: ${func}
    ${usernameLog}
    ===========================
  `);
  console.log(message);
  console.log('===========================');
}

module.exports = log;