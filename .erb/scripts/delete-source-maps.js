import path from 'path';
import rimraf from 'rimraf';
<<<<<<< HEAD
import webpackPaths from '../configs/webpack.paths.js';
=======
import webpackPaths from '../configs/webpack.paths';
>>>>>>> template/main

export default function deleteSourceMaps() {
  rimraf.sync(path.join(webpackPaths.distMainPath, '*.js.map'));
  rimraf.sync(path.join(webpackPaths.distRendererPath, '*.js.map'));
}
