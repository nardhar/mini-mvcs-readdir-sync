# Mini MVCS Readdir Sync

Small library for synchronous reading the files of a folder (just the path, not its content), used for importing artifacts for the mini-mvcs lib stack

Extracted first from Mini MVCS Library and from Node Backend Skel for individual use without any other dependencies.

## Features

- Read files from a folder and its subfolders
- Uses fs.readdirSync recursively, so it will **block** the event-loop, but it should not matter since it is just used for loading artifacts at the start of an app.
- May receive a list of ignored files per exact match or with a callback

## Installation

Using npm:

```
npm install --save mini-mvcs-readdir-sync
```

## Usage

This library provides only one method: readdirSync (or whatever name you imported it), so just call it for returning the list of files within the folder

```javascript
const readdirSync = require('mini-mvcs-readdir-sync');

// folder estructure example:
// /folder/dir1
// /folder/dir1/file1.js
// /folder/dir1/file2.js
// /folder/dir2
// /folder/dir2/file1.js
// /folder/dir2/file2.js

const fileList = readdirSync('/folder');
console.log(fileList);
// result will be:
// [
//   'dir1',
//   'dir1/file1.js',
//   'dir1/file2.js',
//   'dir2',
//   'dir2/file1.js',
//   'dir2/file2.js'
// ]
```

You can pass an array in order to ignore some files:

```javascript
// using the same example as above
const fileList = readdirSync('/folder', ['file1.js']);
console.log(fileList);
// result will be:
// [
//   'dir1',
//   'dir1/file2.js',
//   'dir2',
//   'dir2/file2.js'
// ]
```

or even use a callback (if equals true, then it is not added):

```javascript
// using the same example as above
const fileList = readdirSync('/folder', [(f) => f.endsWith('2.js')]);
console.log(fileList);
// result will be:
// [
//   'dir1',
//   'dir1/file1.js',
//   'dir2',
//   'dir2/file1.js'
// ]
```

## License

[MIT](https://github.com/nardhar/mini-mvcs-readdir-sync/blob/master/LICENSE)
