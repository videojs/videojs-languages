# videojs-languages

A CLI program for converting [video.js JSON language files](https://github.com/videojs/video.js/blob/master/docs/guides/languages.md#creating-the-language-file) into [executable video.js language definitions](https://github.com/videojs/video.js/blob/master/docs/guides/languages.md#adding-languages-to-videojs).

## Installation

```sh
$ npm install -g videojs-languages
```

This will install the `vjslang` binary on your `$PATH`.

## CLI Usage

The `vjslang` binary takes any number of [glob-like arguments](https://www.npmjs.com/package/minimatch) for targeting `.json` files:

```sh
$ vjslang **/*.json foo/bar/*.json
```

If no glob arguments are given, for example:

```sh
$ vjslang
```

The program will fall back to `lang/*.json`.

### Specifying a Destination Directory

By default, each converted `.js` file will be output alongside its source `.json` file, but a `--dir`/`-d` option can be used to specify a directory where _all_ `.js` file(s) will end up:

```sh
$ vjslang foo/bar.json --dir baz
```

The directory will be created if it does not exist. If creation fails, `vjslang` will fall back to its default behavior.

### Options

The `--dir`/`-d` option is the most interesting/useful. For full option documentation refer to:

```sh
$ vjslang --help
```

## API Usage

There is a very simple programmatic API that can be used in your own programs. It is used like this:

```js
import convert from 'videojs-languages';

convert(['foo/bar.json', 'baz/*.json'], 'langs');
```

## License

Apache-2.0
