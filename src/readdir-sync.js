const fs = require('fs');
const path = require('path');

const isIgnored = (ignoreList, fileName) => {
  return ignoreList.some((ignoreParam) => {
    if (typeof ignoreParam === 'function') {
      return ignoreParam(fileName);
    }
    return ignoreParam === fileName;
  });
};

/**
 * Loads all files within a dir, returning a list of objects with the filename and its path
 * @param {String} dir Directory path
 * @param {Array<String\Function>} ignoreList Files to be ignored
 * @return {Array<Object>} List of files with its name and path
 */
const readdirSync = (dir, ignoreList) => {
  // checking if the folder exists and if it can be read
  try {
    fs.accessSync(dir, fs.constants.R_OK);
  } catch (error) {
    return [];
  }

  const fileList = [];
  fs.readdirSync(dir).forEach((file) => {
    // it builds the file's full path
    const filePath = path.join(dir, file);
    // asking if it is not a directory to try to import it
    if (!fs.statSync(filePath).isDirectory()) {
      // does not import ignored files
      if (!isIgnored(ignoreList, file)) {
        // adds the file info to the current fileList array
        fileList.push(filePath);
      }
      // if it is not a loadable file, then it doesn't add anything
    } else {
      // if it is a directory then it runs the same function over this directory
      readdirSync(filePath, ignoreList).forEach((fileInDir) => {
        fileList.push(fileInDir);
      });
    }
  }, []);

  return fileList;
};

module.exports = readdirSync;
