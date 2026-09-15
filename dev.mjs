import {context} from 'esbuild';
const ctx=await context({entryPoints:['src/main.js'],bundle:true,outfile:'dist/app.js',logLevel:'info'});
try{
  await ctx.watch();
  await ctx.serve({host:'127.0.0.1',port:5173,servedir:'dist'});
  console.log('\nNamo studija: http://localhost:5173\nSustabdyti: Ctrl+C\n');
}catch(error){await ctx.dispose();console.error('Nepavyko paleisti. Patikrinkite, ar 5173 prievadas laisvas.',error.message);process.exitCode=1;}
for(const event of ['SIGINT','SIGTERM'])process.once(event,async()=>{await ctx.dispose();process.exit(0);});
