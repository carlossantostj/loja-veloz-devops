import http from 'node:http';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
const { Pool } = pg;

const PORT=Number(process.env.PORT||3001);
const DATABASE_URL=process.env.DATABASE_URL;
const pool=new Pool({connectionString:DATABASE_URL});
const metrics={requests:0,errors:0};

function send(res,status,data,traceId){res.writeHead(status,{'content-type':'application/json; charset=utf-8','x-trace-id':traceId});res.end(JSON.stringify(data));}
function log(level,message,traceId,extra={}){console.log(JSON.stringify({timestamp:new Date().toISOString(),level,service:'orders',message,trace_id:traceId,...extra}));}
async function readBody(req){let raw='';for await(const c of req)raw+=c;return raw?JSON.parse(raw):{};}
async function init(){await pool.query(`CREATE TABLE IF NOT EXISTS orders(id SERIAL PRIMARY KEY, customer TEXT NOT NULL, items JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'CREATED', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);}
async function handle(req,res,traceId){
  if(req.url==='/orders' && req.method==='POST'){
    const data=await readBody(req);
    if(!data.customer || !Array.isArray(data.items)) return send(res,400,{error:'customer_and_items_required'},traceId);
    const r=await pool.query('INSERT INTO orders(customer,items) VALUES($1,$2) RETURNING *',[data.customer,JSON.stringify(data.items)]);
    return send(res,201,r.rows[0],traceId);
  }
  if(req.url==='/orders' && req.method==='GET'){
    const r=await pool.query('SELECT * FROM orders ORDER BY id DESC');
    return send(res,200,r.rows,traceId);
  }
  send(res,404,{error:'route_not_found'},traceId);
}
const server=http.createServer(async(req,res)=>{
  metrics.requests++;const traceId=req.headers['x-trace-id']||randomUUID();
  try{
    if(req.url==='/health'){await pool.query('SELECT 1');return send(res,200,{status:'ok',service:'orders'},traceId);}
    if(req.url==='/metrics')return send(res,200,{service:'orders',...metrics},traceId);
    await handle(req,res,traceId);
  }catch(err){metrics.errors++;log('error','orders_error',traceId,{error:err.message});send(res,500,{error:'internal_error'},traceId);}
});
init().then(()=>server.listen(PORT,'0.0.0.0',()=>log('info','service_started','startup',{port:PORT}))).catch(err=>{console.error(err);process.exit(1)});
