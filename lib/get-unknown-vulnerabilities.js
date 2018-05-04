const _differenceWith = require('lodash.differencewith');
const _isEqual = require('lodash.isequal');

module.exports = ({ vulnerabilities, exceptions = [] }) => {
  return _differenceWith(vulnerabilities, exceptions, (vuln, exception) => {
    const { id, advisory, path } = vuln;
    return _isEqual({ id, advisory, path }, exception);
  });
};
