'use strict';
const fs=require('fs'),path=require('path');
module.exports=async function inspect(mod,root){
 const flag=path.join(root,'inspect-customizer.once');
 if(!fs.existsSync(flag))return;
 const stat=fs.lstatSync(flag);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>100)throw Error('Invalid inspection request');
 fs.unlinkSync(flag);
 const info=mod.clientInterface.info;
 const report={revision:2,pid:info.pid,patch:[info.majorPatchVersion,info.minorPatchVersion],time:new Date().toISOString(),readOnly:true,queries:[]};
 const file=path.join(root,'customizer-data-v2-'+info.pid+'.json');
 function save(){const text=JSON.stringify(report,null,2);if(Buffer.byteLength(text)>4194304)throw Error('Inspection report size limit');const temp=file+'.tmp';fs.writeFileSync(temp,text);fs.renameSync(temp,file);}
 function bounded(value){let nodes=0,truncated=false;function visit(v,depth){if(++nodes>30000||depth>16){truncated=true;return '[bounded]';}if(typeof v==='bigint')return v.toString();if(v===null||typeof v!=='object'){if(typeof v==='string'&&v.length>2048){truncated=true;return v.slice(0,2048);}return v;}if(Array.isArray(v)){if(v.length>5000)truncated=true;return v.slice(0,5000).map(x=>visit(x,depth+1));}const entries=Object.entries(v);if(entries.length>160)truncated=true;return Object.fromEntries(entries.slice(0,160).map(([k,x])=>[k,visit(x,depth+1)]));}return {data:visit(value,0),truncated};}
 async function ask(query,args=[],children=true){let timer;try{const data=await Promise.race([mod.queryData(query,args,true,children),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Inspection query timed out')),5000);})]);const entry=Object.assign({query,args},bounded(data));if(Buffer.byteLength(JSON.stringify(entry))>1048576){entry.data={omitted:true,reason:'Query report size limit'};entry.truncated=true;}report.queries.push(entry);save();return data;}catch(error){report.queries.push({query,args,error:String(error.message||error)});save();throw error;}finally{clearTimeout(timer);}}
 try{
  save();
  // Names and hierarchy were observed in the pinned Phoenix executable's
  // constant section. No wildcard enumeration or guessed table names.
  const races=await ask('/PCCustomizePreset/PresetRace/',[],false);
  const castanic=Array.isArray(races)?races.find(n=>n&&n.attributes&&String(n.attributes.race).toLowerCase()==='castanic'):null;
  if(!castanic)throw Error('Phoenix did not expose the Castanic customization metadata');
  const race=castanic.attributes.race;
  await ask('/PCCustomizePreset/PresetRace@race=?/',[race]);
  await ask('/PcFigureDefine/FigureBase@race=?/',[race]);
  await ask('/PcFigureExDefine/FigureBase@race=?/',[race]);
  report.complete=true;save();
 }catch(error){report.complete=false;report.error=String(error.message||error);save();}
};
