/* global suite, setup, teardown, test */

const {assert} = require('chai');
const fs = require('fs');
const mock = require('mock-fs');
const tsmlb = require('tsmlb');

const {
  nonEmptyStr,
  normalizePatterns,
  normalizeDir,
  destination,
  findSources,
  processSources
} = require('../src/lib');

suite('lib', () => {

  setup(() => {
    mock({
      a: {
        b: {
          'x.json': '{"x":true}',
          'i.txt': 'hello there',
          'y.json': '{"y":true}'
        }
      },
      b: {
        'z.json': '{"z":true}',
        'j.js': 'alert("ignore me")'
      }
    });
  });

  teardown(() => {
    mock.restore();
  });

  test('nonEmptyStr', () => {
    assert.ok(nonEmptyStr('foo'));
    assert.ok(nonEmptyStr('  bar\t'));
    assert.notOk(nonEmptyStr(''));
    assert.notOk(nonEmptyStr('   '));
    assert.notOk(nonEmptyStr('\r\n'));
    assert.notOk(nonEmptyStr(null));
    assert.notOk(nonEmptyStr());
    assert.notOk(nonEmptyStr({}));
    assert.notOk(nonEmptyStr([]));
    assert.notOk(nonEmptyStr(true));
  });

  test('normalizePatterns', () => {
    assert.sameMembers(normalizePatterns(), ['lang/*.json']);
    assert.sameMembers(normalizePatterns(['', null]), ['lang/*.json']);
    assert.sameMembers(normalizePatterns(['x', '', 'y']), ['x', 'y']);
    assert.sameMembers(normalizePatterns('x/y/z'), ['x/y/z']);
  });

  test('normalizeDir', () => {
    assert.isUndefined(normalizeDir(''));
    assert.strictEqual(normalizeDir('foo'), 'foo');
    assert.strictEqual(normalizeDir('foo/bar/baz'), 'foo/bar/baz');
  });

  test('destination', () => {
    assert.strictEqual(destination('/path/to/foo.json'), '/path/to/foo.js');
    assert.strictEqual(
      destination('/path/to/foo.json', '/other/path'),
      '/other/path/foo.js'
    );
    assert.strictEqual(destination('/path/to/foo.json', null, 'mjs'), '/path/to/foo.mjs');
  });

  test('findSources', () => {
    assert.sameMembers(
      findSources(['a/**/*']),
      ['a/b/x.json', 'a/b/y.json']
    );

    assert.sameMembers(
      findSources(['a/b/*.json', 'b/*']),
      ['a/b/x.json', 'a/b/y.json', 'b/z.json']
    );
  });

  test('processSources', () => {
    const srces = processSources(findSources(['a/**/*']), normalizeDir('c'));

    assert.sameMembers(srces, ['c/x.js', 'c/y.js']);

    assert.strictEqual(
      fs.readFileSync('c/x.js', 'utf8'),
      tsmlb`
        videojs.addLanguage('x', {
          "x": true
        });
      `
    );

    assert.strictEqual(
      fs.readFileSync('c/y.js', 'utf8'),
      tsmlb`
        videojs.addLanguage('y', {
          "y": true
        });
      `
    );
  });

  test('processSourcesAsModules', () => {
    const srces = processSources(findSources(['a/**/*']), normalizeDir('c'), true);

    assert.sameMembers(srces, ['c/x.mjs', 'c/y.mjs']);

    assert.strictEqual(
      fs.readFileSync('c/x.mjs', 'utf8'),
      tsmlb`
        import videojs from "video.js";
        import x from "../a/b/x.json";

        videojs.addLanguage('x', x);
      ` + '\n'
    );

    assert.strictEqual(
      fs.readFileSync('c/y.mjs', 'utf8'),
      tsmlb`
        import videojs from "video.js";
        import y from "../a/b/y.json";

        videojs.addLanguage('y', y);
      ` + '\n'
    );
  });
});
