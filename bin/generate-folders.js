#!/usr/bin/env node
import generate from '../src/generate-folders.js';
import configuration from '../src/configuration';

generate(process.cwd(), configuration(process.cwd()));
