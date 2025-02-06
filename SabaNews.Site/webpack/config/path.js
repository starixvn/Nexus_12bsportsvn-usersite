const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');

const cssPaths = {
    build: 'wwwroot/minify/css',
};

const scriptPaths = {
    build: 'wwwroot/minify/js',

};

module.exports = {
    projectRoot: projectRoot,
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};