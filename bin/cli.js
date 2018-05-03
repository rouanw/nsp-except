#! /usr/bin/env node
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const { add } = require('../lib');

const getCommand = (c) => {
  const availableCommands = {
    add,
  };
  if (availableCommands[c]) {
    return availableCommands[c];
  }
  console.error(`${c} is not a valid nsp-except command`);
  return process.exit(1);
};

const command = getCommand(argv._[0]);

command()
  .catch(console.error);
