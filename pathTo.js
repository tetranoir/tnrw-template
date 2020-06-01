'use strict';

const path = require('path');
const fs = require('fs');

const env = require('dotenv').config().parsed;

// Project root
function resolve(relativePath) {
  return path.resolve(__dirname, relativePath);
}

// Use this to configure the path to different parts of the project
const pathTo = {
  root: resolve('.'),
  nodeModules: resolve('node_modules'),
  output: resolve(env.CLIENT_OUTPUT),
  client: resolve(path.join('src', 'client', env.CLIENT)),
};

module.exports = pathTo;
