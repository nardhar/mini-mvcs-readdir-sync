const { constants } = require('fs');
const { expect } = require('chai');
const rewiremock = require('rewiremock').default;

rewiremock('fs').with({
  constants,
  accessSync(dir, mode = constants.F_OK) {
    if (dir === 'notExistent') {
      throw new Error('Folder not found');
    } else if (dir === 'notReadable' && mode === constants.R_OK) {
      throw new Error('Folder not readable');
    }
  },
  readdirSync(dir) {
    if (dir === 'dir1') {
      return ['dir11', 'file1.js', 'file2.js', 'ignore.js'];
    }
    if (dir === 'dir1/dir11') {
      return ['file11.js', 'file12.js'];
    }
    return [];
  },
  statSync(path) {
    return {
      isDirectory() {
        return path.substring(path.lastIndexOf('/') + 1).substring(0, 3) === 'dir';
      },
    };
  },
});

rewiremock('path').with({
  join(...args) {
    return args.join('/');
  },
});

let readdirSync;

describe('Unit Testing file Util module', () => {
  before(() => {
    rewiremock.enable();
    readdirSync = require('../src/readdir-sync');
  });

  after(() => { rewiremock.disable(); });

  it('should load all files in all folders', (done) => {
    const filePathList = readdirSync('dir1', []);
    expect(filePathList).to.have.length(5);
    expect(filePathList).to.deep.include('dir1/file1.js');
    expect(filePathList).to.deep.include('dir1/file2.js');
    expect(filePathList).to.deep.include('dir1/ignore.js');
    expect(filePathList).to.deep.include('dir1/dir11/file11.js');
    expect(filePathList).to.deep.include('dir1/dir11/file12.js');
    done();
  });

  it('should load all files that end with `1.js` in all folders', (done) => {
    const filePathList = readdirSync('dir1', [(file) => { return !file.endsWith('1.js'); }]);
    expect(filePathList).to.have.length(2);
    expect(filePathList).to.deep.include('dir1/file1.js');
    expect(filePathList).to.deep.include('dir1/dir11/file11.js');
    done();
  });

  it('should load all files in all folders but ignore ignore.js', (done) => {
    const filePathList = readdirSync('dir1', ['ignore.js']);
    expect(filePathList).to.have.length(4);
    expect(filePathList).to.deep.include('dir1/file1.js');
    expect(filePathList).to.deep.include('dir1/file2.js');
    expect(filePathList).to.deep.include('dir1/dir11/file11.js');
    expect(filePathList).to.deep.include('dir1/dir11/file12.js');
    done();
  });

  it('should not load non existent folders', (done) => {
    const filePathList = readdirSync('notExistent', []);
    expect(filePathList).to.have.length(0);
    done();
  });

  it('should not load non readable folders', (done) => {
    const filePathList = readdirSync('notReadable', []);
    expect(filePathList).to.have.length(0);
    done();
  });
});
