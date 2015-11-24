/* global suite, setup, teardown, test */

import {assert} from 'chai';
import fs from 'fs';
import mock from 'mock-fs';
import tsmlb from 'tsmlb';

import convert from '../es5/api';

suite('api', () => {

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

  test('convert', () => {
    let result = convert(['a/**/*', 'b/*.json'], 'c');

    assert.sameMembers(result.srces, ['a/b/x.json', 'a/b/y.json', 'b/z.json']);
    assert.sameMembers(result.dests, ['c/x.js', 'c/y.js', 'c/z.js']);

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

    assert.strictEqual(
      fs.readFileSync('c/z.js', 'utf8'),
      tsmlb`
        videojs.addLanguage('z', {
          "z": true
        });
      `
    );
  });
});
