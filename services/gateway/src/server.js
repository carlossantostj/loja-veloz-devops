import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 3000);
const ORDERS_URL = process.env.ORDERS_URL || 'http://localhost:3001';
const PAYMENTS_URL = process.env.PAYMENTS_URL || 'http://localhost:3002';
const INVENTORY_URL = process.env.INVENTORY_URL || 'http://localhost:3003';
const metrics = { requests: 0, errors: 0 };

function send(res, status, data, traceId) {
  const body = JSON.stringify(data);
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','x-trace-id':traceId});
  res.end(body);
}
function log(level, message, traceId, extra={}) {
  console.log(JSON.stringify({timestamp:new Date().toISOString(),level,service:'gateway',message,trace_id:traceId,...extra}));
}
async function body(req) {
  let raw=''; for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}
async function proxy(url, req, traceId, payload) {
  const r = await fetch(url, {method:req.method, headers:{'content-type':'application/json','x-trace-id':traceId}, body: payload ? JSON.stringify(payload) : undefined});
  return {status:r.status, data:await r.json()};
}
const server=http.createServer(async (req,res)=>{
  metrics.requests++;
  const traceId=req.headers['x-trace-id'] || randomUUID();
  try {
    if(req.url==='/health') return send(res,200,{status:'ok',service:'gateway'},traceId);
    if(req.url==='/metrics') return send(res,200,{service:'gateway',...metrics},traceId);
    const payload=(req.method==='POST'||req.method==='PUT') ? await body(req) : undefined;
    let target;
    if(req.url==='/api/orders' && req.method==='POST') target=await proxy(`${ORDERS_URL}/orders`,req,traceId,payload);
    else if(req.url==='/api/orders' && req.method==='GET') target=await proxy(`${ORDERS_URL}/orders`,req,traceId);
    else if(req.url==='/api/payments' && req.method==='POST') target=await proxy(`${PAYMENTS_URL}/payments`,req,traceId,payload);
    else if(req.url==='/api/products' && req.method==='GET') target=await proxy(`${INVENTORY_URL}/products`,req,traceId);
    else return send(res,404,{error:'route_not_found'},traceId);
    send(res,target.status,target.data,traceId);
  } catch(err) {
    metrics.errors++; log('error','gateway_error',traceId,{error:err.message});
    send(res,502,{error:'upstream_unavailable'},traceId);
  }
});
server.listen(PORT,'0.0.0.0',()=>log('info','service_started','startup',{port:PORT}));
