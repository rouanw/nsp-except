const nsp = require('./nsp-wrapper');
const chalk = require('chalk');
const getUnknownVulnerabilities = require('./get-unknown-vulnerabilities');
const getExceptions = require('./get-exceptions');

module.exports = () => {
  // Note: nsp only checks dependencies, not devDependencies. See https://github.com/nodesecurity/nsp/issues/87
  console.log(chalk.yellow('Checking for known security vulnerabilities with nsp'));

  const exceptions = getExceptions();

  return nsp.check()
    .then(({ data }) => getUnknownVulnerabilities({ vulnerabilities: data, exceptions }))
    .then((unknownVulnerabilities) => {
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
