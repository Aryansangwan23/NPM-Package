import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcPath = path.join(rootDir, 'src', 'index.js');
const distDir = path.join(rootDir, 'dist');
const distPath = path.join(distDir, 'index.cjs');

fs.mkdirSync(distDir, { recursive: true });

let source = fs.readFileSync(srcPath, 'utf8');

// Replace "export function timeAgo" with "function timeAgo"
source = source.replace(/export\s+function\s+timeAgo\s*\(/g, 'function timeAgo(');

// Remove "export default timeAgo;"
source = source.replace(/export\s+default\s+timeAgo\s*;?/g, '');

// Append CommonJS exports supporting both default and named imports
const cjsFooter = `
module.exports = timeAgo;
module.exports.timeAgo = timeAgo;
module.exports.default = timeAgo;
`;

const cjsContent = source.trimEnd() + '\n' + cjsFooter.trimStart();

fs.writeFileSync(distPath, cjsContent, 'utf8');
console.log('Successfully built dist/index.cjs');
