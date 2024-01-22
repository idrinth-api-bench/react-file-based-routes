#!/usr/bin/env node
import generate from '../src/generate-folders.js';
import configuration from '../src/configuration.js';

generate(process.cwd(), configuration(process.cwd(), process.argv));
