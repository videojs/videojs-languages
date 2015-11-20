#!/usr/bin/env node

import cli from 'cli';
import {convert} from './api';

cli.main((args, options) => {

  // Parse files from args.
  let files = args;

  // Probably do some logging of which files, etc. Perhaps a debug option.

  convert(files);
});
