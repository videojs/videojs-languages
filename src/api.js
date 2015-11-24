import {
  normalizePatterns,
  normalizeDir,
  findSources,
  processSources
} from './lib';

/**
 * Convert any number of target files or directories (filtering down to
 * only `.json`) into executable `.js` files.
 *
 * File names should match the language they are in. For example, a French
 * file should be fr.json.
 *
 * @param  {Array|String} patterns
 *         One or more `minimatch` patterns.
 *
 * @param  {String} [dir]
 *         A directory, relative to cwd, into which converted files will be
 *         placed. If the directory does not exist, an attempt will be made
 *         to create it. If not provided or creation fails, converted .js
 *         files will be placed alongside their .json sources.
 *
 * @return {Object}
 *         An object with `srces` and `dests` arrays.
 */
const convert = (patterns, dir) => {
  let srces = findSources(normalizePatterns(patterns));
  let dests = processSources(srces, normalizeDir(dir));

  return {srces, dests};
};

export default convert;
