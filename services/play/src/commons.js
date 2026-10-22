// Commons launch/result contracts and storage keys are preserved independently of Vue.
export function commonsBridge(base,onSaved){
 const params=new URLSearchParams(location.search),queueKey='edutictac-play-result-queue';
 let assignmentId=params.get('assignment_id')||'',launchContext=params.get('launch_context')||'';
 const attemptId=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const read=()=>{try{const q=JSON.parse(localStorage.getItem(queueKey)||'[]');return Array.isArray(q)?q:[];}catch{return [];}};
 function queue(payload){if(!payload.launch_context)return;const q=read();if(!q.some(item=>item.result_id===payload.result_id&&item.assignment_id===payload.assignment_id)){q.push(payload);localStorage.setItem(queueKey,JSON.stringify(q.slice(-20)));}}
 async function send(payload){try{return await fetch(base+'/api/commons/score',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});}catch{return null;}}
 async function flush(){
  if(!navigator.onLine)return;
  // Remove only confirmed entries; a result queued while flushing must survive.
  for(const payload of read()){
   const r=await send(payload);if(!r||(!r.ok&&r.status>=500))continue;
   const current=read().filter(item=>!(item.result_id===payload.result_id&&item.assignment_id===payload.assignment_id));
   if(current.length)localStorage.setItem(queueKey,JSON.stringify(current));else localStorage.removeItem(queueKey);
  }
 }
 async function launch(){
  const token=params.get('launch_token');if(token&&!launchContext){
   const response=await fetch(base+'/api/commons/launch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})});if(!response.ok)throw new Error('launch');
   const data=await response.json();assignmentId=data.assignment.id;launchContext=data.context_id;
   const url=new URL(location.href);url.searchParams.delete('launch_token');url.searchParams.set('assignment_id',assignmentId);url.searchParams.set('launch_context',launchContext);history.replaceState({},'',url.pathname+url.search);
  }
 }
 function query(){const p=new URLSearchParams();if(assignmentId)p.set('assignment_id',assignmentId);if(launchContext)p.set('launch_context',launchContext);return p.size?'?'+p:'';}
 async function report(statement,id){
  if(!assignmentId||!id||id.startsWith('preview-'))return;
  const result=statement?.result||{},verb=String(statement?.verb?.id||'').split('/').pop();
  if(!['completed','passed','failed'].includes(verb)&&result.completion!==true)return;
  if(!result.score||result.score.raw===undefined||result.score.max===undefined)return;
  const max=Number(result.score.max),raw=Number(result.score.raw);if(!Number.isFinite(max)||max<=0||!Number.isFinite(raw))return;
  const resultId=String(statement.id||`urn:edutictac-play:${attemptId}`);
  const payload={activity_id:id,assignment_id:assignmentId,launch_context:launchContext,result_id:resultId,score:Math.max(0,Math.min(100,Math.round(raw/max*100))),metadata:{source:'h5p-xapi',statement_id:resultId,raw_score:raw,max_score:max,verb,attempt:1}};
  const response=await send(payload);if(response?.ok)onSaved(id);else if(!response||response.status>=500)queue(payload);
 }
 return {launch,query,report,flush};
}
