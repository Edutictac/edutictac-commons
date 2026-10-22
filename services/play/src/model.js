export const TYPES=['multiple-choice','true-false','memory','matching','classify','ordering','fill-blanks','find-words','drag-text','mark-words','dialog-cards','crossword','compound'];
export const CHILD_TYPES=['multiple-choice','true-false','fill-blanks','drag-text','mark-words','matching','classify','ordering'];
export const TYPE_LABELS={'multiple-choice':'multipleChoice','true-false':'trueFalse',memory:'memory',matching:'matching',classify:'classify',ordering:'ordering','fill-blanks':'fillBlanks','find-words':'findWords','drag-text':'dragText','mark-words':'markWords','dialog-cards':'dialogCards',crossword:'crossword',compound:'compound.card'};
export const clone=value=>JSON.parse(JSON.stringify(value));
export function newActivity(type='multiple-choice'){
 const a={type,title:'',question:'',subject:'',educational_stage:'',educational_level:'',tags:[]};
 if(type==='multiple-choice')a.answers=[{text:'',correct:true},{text:'',correct:false}];
 if(type==='true-false')a.correct=true;
 if(type==='memory')a.cards=[{text:'',image:''},{text:'',image:''}];
 if(type==='matching')a.pairs=[{left:'',right:'',leftImage:'',rightImage:''},{left:'',right:'',leftImage:'',rightImage:''}];
 if(['classify','ordering'].includes(type)){a.categories=(type==='ordering'?['1','2','3']:['','']).map(name=>({name}));a.items=Array.from({length:3},()=>({text:'',category:0,image:''}));}
 if(['fill-blanks','drag-text','mark-words'].includes(type))a.text='';
 if(type==='find-words')a.words=['agua','tierra','planta','animal'];
 if(type==='dialog-cards')a.cards=[{front:'Capital de Francia',back:'París'},{front:'Planeta rojo',back:'Marte'},{front:'2 + 2',back:'4'}];
 if(type==='crossword')a.words=[{answer:'planeta',clue:'Cuerpo que gira alrededor de una estrella'},{answer:'océano',clue:'Gran extensión de agua salada'},{answer:'montaña',clue:'Elevación natural del terreno'},{answer:'bosque',clue:'Lugar poblado de árboles'}];
 if(type==='compound'){a.activities=[newActivity(),newActivity()];a.passPercentage=60;a.randomQuestions=false;}
 return a;
}
export function hydrate(activity){return {...newActivity(TYPES.includes(activity?.type)?activity.type:'multiple-choice'),...clone(activity)};}
export function serialize(form,language){
 const a={type:form.type,title:String(form.title||'').trim(),question:String(form.question||'').trim(),language,subject:form.subject||'',educational_stage:form.educational_stage||'',educational_level:form.educational_level||'',tags:clone(form.tags||[])};
 const fields={'multiple-choice':['answers'],'true-false':['correct'],memory:['cards'],matching:['pairs'],classify:['categories','items'],ordering:['categories','items'],'fill-blanks':['text'],'drag-text':['text'],'mark-words':['text'],'find-words':['words'],'dialog-cards':['cards'],crossword:['words'],compound:['passPercentage','randomQuestions']};
 for(const field of fields[a.type]||[])a[field]=clone(form[field]);
 if(a.type==='compound')a.activities=form.activities.map(child=>{const result=serialize(child,language);if(child.sourceActivityId)result.sourceActivityId=child.sourceActivityId;return result;});
 // Preserve existing sharing metadata when creating an edited copy.
 if(form.visibility)a.visibility=form.visibility;
 return a;
}
export function validate(a,t){
 const errors=[];if(!a.title)errors.push(t('errors.title'));if(!a.question)errors.push(t('errors.question'));
 const add=(test,key)=>{if(test)errors.push(t('errors.'+key));};
 if(a.type==='multiple-choice'){add(a.answers.length<2||a.answers.length>8||a.answers.some(v=>!v.text.trim()),'answers');add(!a.answers.some(v=>v.correct),'correct');}
 if(a.type==='memory')add(a.cards.length<2||a.cards.length>12||a.cards.some(v=>!v.text.trim()),'cards');
 if(a.type==='matching')add(a.pairs.length<2||a.pairs.length>8||a.pairs.some(v=>!v.left.trim()||!v.right.trim()),'pairs');
 if(['classify','ordering'].includes(a.type)){add(a.categories.length<2||a.categories.length>12||a.categories.some(v=>!v.name.trim()),'categories');add(a.items.length<3||a.items.length>12||a.items.some(v=>!v.text.trim()||!Number.isInteger(Number(v.category))||v.category<0||v.category>=a.categories.length),'items');}
 if(['fill-blanks','drag-text','mark-words'].includes(a.type))add(!/\*[^*]+\*/.test(a.text),'fillBlanks');
 if(a.type==='dialog-cards')add(a.cards.length<3||a.cards.length>15||a.cards.some(v=>!v.front.trim()||!v.back.trim()),'dialogCards');
 if(a.type==='crossword'){add(a.words.length<4||a.words.length>10||a.words.some(v=>!/^[a-záéíóúüñ]+$/i.test(v.answer)||v.answer.length>20||!v.clue.trim()),'crossword');add(new Set(a.words.map(v=>v.answer.toLowerCase())).size!==a.words.length,'crosswordUnique');}
 if(a.type==='find-words'){add(a.words.length<4||a.words.length>12||a.words.some(v=>!/^[a-záéíóúüñ]+$/i.test(v)||v.length>15),'findWords');add(new Set(a.words.map(v=>v.toLowerCase())).size!==a.words.length,'findWordsUnique');}
 if(a.type==='compound'){
  if(a.activities.length<2||a.activities.length>10||!Number.isFinite(a.passPercentage)||a.passPercentage<0||a.passPercentage>100)errors.push(t('compound.error'));
  a.activities.forEach((child,i)=>errors.push(...validate(child,t).map(error=>`${i+1}. ${error}`)));
 }
 return errors;
}
export async function optimizeImage(file){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>12*1024*1024)throw new Error('image');
 const bitmap=await createImageBitmap(file);
 try{
  const scale=Math.min(1,640/bitmap.width,360/bitmap.height),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  let quality=.78,blob;
  do{blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));quality-=.08;}while(blob&&blob.size>400*1024&&quality>=.4);
  if(!blob||blob.type!=='image/webp'||blob.size>400*1024)throw new Error('image');
  return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
 }finally{bitmap.close();}
}
