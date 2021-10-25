<<<<<<< HEAD
const rimraf = require('rimraf');
const webpackPaths = require('../configs/webpack.paths.js');
const process = require('process');

const args = process.argv.slice(2);
const commandMap = {
  dist: webpackPaths.releasePath,
  release: webpackPaths.distPath,
=======
import rimraf from 'rimraf';
import webpackPaths from '../configs/webpack.paths.ts';
import process from 'process';

const args = process.argv.slice(2);
const commandMap = {
  dist: webpackPaths.distPath,
  release: webpackPaths.releasePath,
>>>>>>> template/main
  dll: webpackPaths.dllPath,
};

args.forEach((x) => {
  const pathToRemove = commandMap[x];
  if (pathToRemove !== undefined) {
    rimraf.sync(pathToRemove);
  }
});
