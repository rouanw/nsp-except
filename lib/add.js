const path = require('path');
const fs = require('fs');
const nsp = require('nsp');

module.exports = () => {
  const cwd = process.cwd();
  const packagePath = path.join(cwd, 'package.json');
  const exceptionPath = path.join(cwd, '.nsp-exceptions.json');

  console.log('Adding current security vulnerabilities to .nsp-exceptions.json');

  return nsp.check({
    path: cwd,
    pkg: JSON.parse(fs.readFileSync(packagePath, 'utf8')),
    baseUrl: 'https://api.nodesecurity.io',
  }).then(({ data, message }) => {
    const vulnerabilities = data.map(({ id, advisory, path }) => ({ id, advisory, path }));
    fs.writeFileSync(exceptionPath, JSON.stringify(vulnerabilities, null, 2));
    console.log(`${message} and added to .nsp-exceptions.json`);
  })
  .catch((error) => {
    console.log('Failed to run Node Security Project check on dependencies', error);
    process.exit(1);
  });
};
