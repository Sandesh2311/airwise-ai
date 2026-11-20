import { access } from 'node:fs/promises';
const required=['server.js','src/core.js','public/index.html','public/styles.css','public/app.js','public/favicon.svg','README.md'];
for(const file of required) await access(new URL(`../${file}`,import.meta.url));
console.log('Build check passed: required server, client, and documentation files are present.');
