import {build} from 'esbuild';
await build({entryPoints:['src/main.js'],bundle:true,minify:true,outfile:'dist/app.js',logLevel:'info'});
