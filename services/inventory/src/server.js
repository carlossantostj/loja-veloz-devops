import http from 'node:http';
import { randomUUID } from 'node:crypto';
const PORT=Number(process.env.PORT||3003);const metrics={requests:0,errors:0};
const products=[{sku:'SKU-001',name:'Notebook',stock:25},{sku:'SKU-002',name:'Mouse',stock:50},{sku:'SKU-003',name:'Teclado',stock:30}];
function send(res,status,data,traceId){res.writeHead(status,{'content-type':'application/json','x-trace-id':traceId});res.end(JSON.stringify(data));}
const server=http.createServer(async(req,res)=>{
 const traceId=req.headers['x-trace-id']||randomUUID();metrics.requests++;
 if(req.url==='/health')return send(res,200,{status:'ok',service:'inventory'},traceId);
 if(req.url==='/metrics')return send(res,200,{service:'inventory',...metrics},traceId);
 if(req.url==='/products'&&req.method==='GET')return send(res,200,products,traceId);
 send(res,404,{error:'route_not_found'},traceId);
});
server.listen(PORT,'0.0.0.0');
