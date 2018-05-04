const path = require('path');
const fs = require('fs');
const nsp = require('nsp');

module.exports = {
  check: () => {
    const cwd = process.cwd();
    const packagePath = path.join(cwd, 'package.json');
  
    return nsp.check({
      path: cwd,
      pkg: JSON.parse(fs.readFileSync(packagePath, 'utf8')),
      baseUrl: 'https://api.nodesecurity.io',
    })
  },
};
