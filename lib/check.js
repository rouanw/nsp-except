const path = require('path');
const fs = require('fs');
const nsp = require('./nsp-wrapper');
const _differenceWith = require('lodash.differencewith');
const _isEqual = require('lodash.isequal');
const chalk = require('chalk');

module.exports = () => {
  const exceptionPath = path.join(process.cwd(), '.nsp-exceptions.json');

  // Note: nsp only checks dependencies, not devDependencies. See https://github.com/nodesecurity/nsp/issues/87
  console.log(chalk.yellow('Checking for known security vulnerabilities with nsp'));
  
  return nsp.check()
    .then(({ data: vulnerabilities, message }) => {
      let exceptions = [];
      try {
        exceptions = JSON.parse(fs.readFileSync(exceptionPath, 'utf8'));
      } catch (error) {
        console.log('No .nsp-exceptions.json found, checking against all advisories');
      }

      const unknownVulnerabilities = _differenceWith(vulnerabilities, exceptions, (vuln, exception) => {
        const { id, advisory, path } = vuln;
        return _isEqual({ id, advisory, path }, exception);
      });
    
      const summary = unknownVulnerabilities.length
        ? chalk.red(`${unknownVulnerabilities.length} vulnerabilities found`)
        : chalk.green('No vulnerabilities found', exceptions.length ? `- ${exceptions.length} advisories ignored`: '');
    
      unknownVulnerabilities.forEach((finding) => {
        console.log('---');
        console.log(`${chalk.red(finding.module)} -`, chalk.red(finding.title));
        console.log();
        console.log('Installed:', finding.version);
        console.log('Vulnerable:', chalk.red(finding.vulnerable_versions === '<=99.999.99999' ? 'All' : finding.vulnerable_versions));
        console.log('Patched:', chalk.green(finding.patched_versions === '<0.0.0' ? 'None' : finding.patched_versions));
        console.log('Path:', finding.path.join(' > '));
        console.log();
        console.log('More Info:', finding.advisory);
        console.log();
      });
    
      console.log(summary);
      console.log();
    
      process.exit(unknownVulnerabilities.length);
    });
};
