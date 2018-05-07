const path = require('path');
const fs = require('fs');

module.exports = () => {
  const exceptionPath = path.join(process.cwd(), '.nsp-exceptions.json');
  let exceptions = [];
  try {
    exceptions = JSON.parse(fs.readFileSync(exceptionPath, 'utf8'));
  } catch (error) {
    console.log('No .nsp-exceptions.json found, checking against all advisories');
  }
  return exceptions;
};
