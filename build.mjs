// Grove Music School — zero-dependency build.
// Copies src/ to dist/. The full template build replaces this in the next commit.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('src', 'dist', { recursive: true });
console.log('Built dist/');
