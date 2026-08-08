import http from 'node:http';
import { randomUUID } from 'node:crypto';
const PORT=Number(process.env.PORT||3002);const metrics={requests:0,errors:0};
function send(res,status,data,traceId){res.writeHead(status,{'content-type':'application/json','x-trace-id':traceId});res.end(JSON.stringify(data));}
async function body(req){let r='';for await(const c of req)r+=c;return r?JSON.parse(r):{};}
const server=http.createServer(async(req,res)=>{
 const traceId=req.headers['x-trace-id']||randomUUID();metrics.requests++;
 try{
  if(req.url==='/health')return send(res,200,{status:'ok',service:'payments'},traceId);
  if(req.url==='/metrics')return send(res,200,{service:'payments',...metrics},traceId);
  if(req.url==='/payments'&&req.method==='POST'){
   const data=await body(req);
   if(!data.order_id) return send(res,400,{error:'order_id_required'},traceId);
   return send(res,201,{order_id:data.order_id,status:'APPROVED',provider:'mock'},traceId);
  }
  send(res,404,{error:'route_not_found'},traceId);
 }catch(err){metrics.errors++;send(res,500,{error:'internal_error'},traceId);}
});
server.listen(PORT,'0.0.0.0');
