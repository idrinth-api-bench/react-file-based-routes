#!/usr/bin/env node
import generate from '../src/generate-routes.js';

generate(process.cwd(), process.argv[2]);
