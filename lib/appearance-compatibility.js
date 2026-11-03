'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib');
const SOURCE_HASH='4f8c47bb2d8069b5526921089fb7cfb088dfd7925d3481b5c8c9feea74bf8429';
const RACES=['human','highelf','aman','castanic','popori','baraka']; // Existing profile template-ID order.
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
let cachedSource;
function sourceData(){
 if(cachedSource)return cachedSource;
 const file=path.join(__dirname,'../resources/asura-appearance-source.json.gz');
 const stat=fs.statSync(file);if(!stat.isFile()||stat.size>262144)throw Error('Referência de aparência inválida.');
 const bytes=fs.readFileSync(file);if(sha(bytes)!==SOURCE_HASH)throw Error('Referência de aparência alterada.');
 const plain=zlib.gunzipSync(bytes);if(plain.length>2097152)throw Error('Referência de aparência excede o limite.');
 const data=JSON.parse(plain);if(data.version!==1||data.source!=='Asura'||data.complete!==true||!Array.isArray(data.queries)||data.queries.length!==6||data.queries.some(q=>q.error||!Array.isArray(q.data)))throw Error('Referência de aparência incompleta.');
 cachedSource=data;return data;
}
function canonical(v){if(Array.isArray(v))return v.map(canonical);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,x])=>[k,canonical(x)]));return v;}
const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
function vector(s){if(typeof s!=='string')throw Error('Cor não disponível na referência.');const parts=s.split(',');const v=parts.map(Number);if(v.length!==4||parts.some(p=>!p.trim())||!v.every(Number.isFinite))throw Error('Cor inválida na referência.');return v;}
function signature(node,type){
 const a=node.attributes;
 if(type==='SkinToneList')return vector(a.color);
 if(type==='HairToneList')return [vector(a.color),vector(a.specColor)];
 if(type==='FaceList'||type==='HairList'){if(!Number.isInteger(a.partId))throw Error('Modelo não disponível na referência.');return {partId:a.partId};}
 if(type==='Decal'){const values={...a};for(const key of ['id','description','icon','isPremium'])delete values[key];return values;}
 throw Error('Tipo de aparência desconhecido.');
}
function children(node,name){const found=node&&node.children&&node.children.filter(n=>n.name===name);if(!found||found.length!==1)throw Error('Lista de aparência ausente ou ambígua: '+name);return found[0].children||[];}
function ids(nodes){const result=new Set();for(const node of nodes){const id=node&&node.attributes&&node.attributes.id;if(!Number.isInteger(id)||id<0||id>255||result.has(id))throw Error('IDs de aparência inválidos ou duplicados.');result.add(id);}return nodes;}
function byId(nodes,id){return ids(nodes).find(n=>n.attributes.id===id);}
function select(source,target,type){
 if(!source)throw Error('ID de origem não disponível: '+type);
 const key=signature(source,type),matches=ids(target).filter(n=>{try{return equal(signature(n,type),key);}catch(_){return false;}});
 const same=matches.find(n=>n.attributes.id===source.attributes.id);
 if(same)return same.attributes.id;
 if(matches.length!==1)throw Error('Nenhuma correspondência exata e inequívoca: '+type+' / '+source.attributes.id);
 return matches[0].attributes.id;
}
function gender(presets,sex){const root=presets&&presets.filter(n=>n.name==='PresetRace');if(!root||root.length!==1)throw Error('Referência de raça ausente ou ambígua.');const found=root[0].children.filter(n=>n.name==='PresetGender'&&n.attributes.gender===sex);if(found.length!==1)throw Error('Referência de gênero ausente ou ambígua.');return found[0];}
function figures(nodes,sex){const matches=nodes&&nodes.filter(n=>n.name==='FigureBase'&&n.attributes.gender===sex);if(!matches||matches.length!==1)throw Error('Controles faciais indisponíveis.');return matches[0];}
function convert(profile,source,target){
 const sex=profile.gender?'female':'male',a=gender(source.presets,sex),b=gender(target.presets,sex);
 if(!equal(figures(source.figures,sex),figures(target.figures,sex)))throw Error('As definições dos controles faciais diferem entre os clientes.');
 const appearance={...profile.appearance},changes=[];
 for(const [field,type]of [['faceStyle','FaceList'],['hairStyle','HairList'],['skinColor','SkinToneList'],['hairColor','HairToneList']]){
  const id=select(byId(children(a,type),appearance[field]),children(b,type),type);if(id!==appearance[field])changes.push({field,from:appearance[field],to:id});appearance[field]=id;
 }
 const sourceDecal=byId(children(a,'DecalList'),profile.appearance.faceStyle),targetDecal=byId(children(b,'DecalList'),appearance.faceStyle);
 if(!sourceDecal||!targetDecal)throw Error('Decalques do rosto não disponíveis.');
 const decal=select(byId(sourceDecal.children,appearance.faceDecal),targetDecal.children,'Decal');if(decal!==appearance.faceDecal)changes.push({field:'faceDecal',from:appearance.faceDecal,to:decal});appearance.faceDecal=decal;
 // Decoration is an on/off choice whose native IDs must remain the same.
 const decoA=byId(children(a,'DecoList'),profile.appearance.faceStyle),decoB=byId(children(b,'DecoList'),appearance.faceStyle);
 const da=decoA?decoA.children:[],db=decoB?decoB.children:[];
 if(!(appearance.tattoos===0&&da.length===0&&db.length===0)){
  const x=byId(da,appearance.tattoos),y=byId(db,appearance.tattoos);if(!x||!y)throw Error('Adorno do rosto não disponível.');
  const meaningful=n=>Object.fromEntries(Object.entries(n.attributes).filter(([key])=>!['description','icon'].includes(key)));if(!equal(meaningful(x),meaningful(y)))throw Error('O adorno do rosto difere entre os clientes.');
 }
 return {profile:{...profile,appearance},changes};
}
function findSource(data,table,race){const found=data.queries.filter(q=>q.query.startsWith('/'+table+'/')&&q.args[0]===race);return found.length===1?found[0].data:null;}
function waitReady(client){if(Number.isInteger(client.info.protocolVersion))return Promise.resolve();return new Promise((resolve,reject)=>{let timer;const cleanup=()=>{clearTimeout(timer);client.removeListener('ready',ready);client.removeListener('disconnect',closed);};const ready=()=>{cleanup();resolve();},closed=()=>{cleanup();reject(Error('Cliente desconectado durante a preparação da aparência.'));};client.once('ready',ready);client.once('disconnect',closed);timer=setTimeout(()=>{cleanup();reject(Error('Cliente não confirmou os dados de aparência dentro do prazo.'));},15000);});}
async function query(mod,table,race){let timer;try{const data=await Promise.race([mod.queryData('/'+table+'/'+(table==='PCCustomizePreset'?'PresetRace':'FigureBase')+'@race=?/',[race],true,true),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Consulta de aparência excedeu o prazo.')),8000);})]);if(!Array.isArray(data)||!data.length||Buffer.byteLength(JSON.stringify(data))>2097152)throw Error('Dados locais de aparência inválidos.');return data;}finally{clearTimeout(timer);}}
async function adapt(mod,entries){
 const source=sourceData(),races=new Map(),warnings=[],converted=[];
 for(const entry of entries){const p=entry.profile;if(p.appearanceOrigin==='phoenix')continue;if(p.appearanceOrigin!==undefined&&p.appearanceOrigin!=='asura')throw Error('Origem de aparência desconhecida: '+entry.profile.profileName);const race=RACES[p.race];if(!findSource(source,'PCCustomizePreset',race)){warnings.push('Sem referência de origem para '+entry.profile.profileName+'; mantendo os IDs do perfil.');continue;}races.set(race,null);}
 if(races.size){await waitReady(mod.clientInterface);for(const race of races.keys())races.set(race,{presets:await query(mod,'PCCustomizePreset',race),figures:await query(mod,'PcFigureDefine',race)});}
 const result=entries.map(entry=>{
  const p=entry.profile,race=RACES[p.race],target=races.get(race);if(p.appearanceOrigin==='phoenix'||!target)return entry;
  let value;try{value=convert(p,{presets:findSource(source,'PCCustomizePreset',race),figures:findSource(source,'PcFigureDefine',race)},target);}catch(error){throw Error(p.profileName+': '+error.message);}
  if(value.changes.length)converted.push({name:p.profileName,changes:value.changes});return {...entry,profile:value.profile};
 });
 return {entries:result,converted,warnings};
}
module.exports={adapt,convert,sourceData,waitReady};
