import { access, readFile } from 'node:fs/promises';
import vercelHandler from '../api/[...path].js';
const required=['server.js','api/[...path].js','vercel.json','src/core.js','public/index.html','public/styles.css','public/app.js','public/favicon.svg','README.md'];
for(const file of required) await access(new URL(`../${file}`,import.meta.url));
const vercel=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
if(vercel.framework!==null||vercel.outputDirectory!=='public'||vercel.buildCommand!=='npm run build')throw new Error('Vercel must use Other, run the project build, and publish public/.');
if(typeof vercelHandler!=='function')throw new Error('The Vercel API entry point must have a default function export.');
console.log('Build check passed: static output and Vercel function entry point are valid.');
