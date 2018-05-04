const path = require('path');
const fs = require('fs');
const nsp = require('./nsp-wrapper');

module.exports = () => {
  console.log('Adding current security vulnerabilities to .nsp-exceptions.json');
  const exceptionPath = path.join(process.cwd(), '.nsp-exceptions.json');

  return nsp.check()
    .then(({ data, message }) => {
      const vulnerabilities = data.map(({ id, advisory, path }) => ({ id, advisory, path }));
      fs.writeFileSync(exceptionPath, JSON.stringify(vulnerabilities, null, 2));
      console.log(`${message} and added to .nsp-exceptions.json`);
    })
    .catch((error) => {
      console.log('Failed to run Node Security Project check on dependencies', error);
      process.exit(1);
    });
};
