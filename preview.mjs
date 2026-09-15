import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist'),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
try{
  let requested=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(requested.endsWith('/'))requested+='index.html';
  const file=path.resolve(root,'.'+requested);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(!(await stat(file)).isFile()){res.writeHead(404).end();return;}
  const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(body);
}catch{res.writeHead(404).end('Nerasta');}
}).listen(port,'127.0.0.1',()=>console.log('Production peržiūra: http://localhost:'+port));
