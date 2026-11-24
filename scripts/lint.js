import { execFileSync } from 'node:child_process';
const files=['server.js','api/[...path].js','src/api-handler.js','src/core.js','public/app.js','scripts/build.js','scripts/lint.js','test/core.test.js','test/server.test.js'];
for(const file of files) execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
console.log(`Syntax lint passed for ${files.length} JavaScript files.`);
