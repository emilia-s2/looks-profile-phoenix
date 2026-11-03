'use strict';
const fs=require('fs'),path=require('path'),zlib=require('zlib');
const Portraits=require('./portraits');
// Append a relocated root movie. All original textures and absolute mip offsets stay in place.
function rootMovie(b, objectName = 'CreateCharacter') {
  let p=0;const take=n=>{if(!Number.isSafeInteger(n)||n<0||p+n>b.length)throw Error('Pacote truncado.');const s=p;p+=n;return s;};
  const i=()=>b.readInt32LE(take(4)),u=()=>b.readUInt32LE(take(4));
  function str(){const n=i();if(!n||Math.abs(n)>65536)throw Error('String inválida.');const len=n>0?n:-n*2,s=take(len);return b.toString(n>0?'latin1':'utf16le',s,s+len-(n>0?1:2));}
  if(u()!==0x9e2a83c1||b.readUInt16LE(take(2))!==897)throw Error('Pacote incompatível.');take(2);i();str();u();
  const nc=i(),no=i(),ec=i(),eo=i(),ic=i(),io=i();
  if(nc<1||nc>4096||ec<1||ec>1024||ic<1||ic>1024)throw Error('Tabelas inválidas.');
  p=no;const names=[];for(let n=0;n<nc;n++){names.push(str());take(8);}
  function name(){const n=i();i();if(n<0||n>=names.length)throw Error('Nome inválido.');return names[n];}
  p=io;const imports=[];for(let n=0;n<ic;n++){name();name();i();imports.push(name());}
  p=eo;let root=null;
  for(let n=0;n<ec;n++){const clazz=i();i();const outer=i(),object=name();take(12);const sizePosition=p,size=i(),offsetPosition=p,offset=size>0?i():0;i();const more=i();i();take(16);if(more<0||more>1024)throw Error('Export inválido.');take(more*4);if(size<1||offset+size>b.length)throw Error('Export fora do pacote.');if(clazz<0&&imports[-clazz-1]==='GFxMovieInfo'&&!outer&&object===objectName){if(root)throw Error('Filme repetido.');root={sizePosition,offsetPosition,size,offset};}}
  if(!root)throw Error('Filme não encontrado.');
  p=root.offset;take(4);
  for(let n=0;n<1024;n++){const prop=name();if(prop==='None')break;const type=name(),sizePosition=p,size=i();i();if(type==='StructProperty'||type==='ByteProperty')name();const dataPosition=p;if(prop==='RawData'){const length=b.readInt32LE(p);if(type!=='ArrayProperty'||length+4!==size||p+size>root.offset+root.size)throw Error('Filme inválido.');return {...root,propertySizePosition:sizePosition,arrayPosition:p,gfxPosition:p+4,gfxLength:length};}take(type==='BoolProperty'?1:size);}
  throw Error('Dados do filme ausentes.');
}
function tags(b) {
  if(b.toString('latin1',0,4)!=='GFX\x09'||b.readUInt32LE(4)!==b.length)throw Error('GFX inválido.');
  let p=8+Math.ceil((5+4*(b[8]>>3))/8)+4;const out=[];
  while(p<b.length){const start=p,v=b.readUInt16LE(p);p+=2;let len=v&63;if(len===63){len=b.readUInt32LE(p);p+=4;}if(p+len>b.length)throw Error('Tag truncada.');out.push({start,payload:p,end:p+len,type:v>>6});p+=len;if(v>>6===0)break;}if(p!==b.length)throw Error('Final GFX inválido.');return out;
}
function tag(type,body){const header=Buffer.alloc(6);header.writeUInt16LE((type<<6)|63);header.writeUInt32LE(body.length,2);return Buffer.concat([header,body]);}
function embed(gfx,icons,actions){
  const list=tags(gfx),first=list.find(t=>t.type===12),frame=list.find(t=>t.type===1);
  if(!first||!frame||first.start>=frame.start)throw Error('Inicialização GFX incompatível.');
  const assets=[],bitmapTags=[];
  for(const icon of icons){const id=60000+icon.index;if(id>65535)throw Error('ID de imagem inválido.');const h=Buffer.alloc(7);h.writeUInt16LE(id);h[2]=5;h.writeUInt16LE(64,3);h.writeUInt16LE(64,5);bitmapTags.push(tag(36,Buffer.concat([h,zlib.deflateSync(icon.argb)])));const entry=Buffer.alloc(2);entry.writeUInt16LE(id);assets.push(entry,Buffer.from('LP_PORTRAIT_'+icon.index+'\0','ascii'));}
  const count=Buffer.alloc(2);count.writeUInt16LE(icons.length);const resourceTags=Buffer.concat([...bitmapTags,tag(56,Buffer.concat([count,...assets]))]);
  const result=Buffer.concat([gfx.subarray(0,first.start),resourceTags,gfx.subarray(first.start,frame.start),tag(12,actions),gfx.subarray(frame.start)]);result.writeUInt32LE(result.length,4);tags(result);return result;
}
function patch(bytes,entries,root,warn=()=>{},objectName='CreateCharacter') {
  const icons=[];
  for(let index=0;index<entries.length;index++){try{const png=Portraits.read(root,entries[index].id);if(png)icons.push({index,argb:Portraits.decode(png)});}catch(error){warn('Ícone ignorado: '+entries[index].id+': '+error.message);}}
  if(!icons.length)return bytes;
  const movie=rootMovie(bytes,objectName),gfx=bytes.subarray(movie.gfxPosition,movie.gfxPosition+movie.gfxLength);
  const actions=fs.readFileSync(path.join(__dirname,'..','resources','portrait-actions.bin'));
  if(actions.length<1||actions.length>16384||actions[actions.length-1]!==0)throw Error('Código de retratos inválido.');
  const next=embed(gfx,icons,actions),delta=next.length-gfx.length;
  const body=Buffer.concat([bytes.subarray(movie.offset,movie.gfxPosition),next,bytes.subarray(movie.gfxPosition+movie.gfxLength,movie.offset+movie.size)]);
  body.writeInt32LE(next.length+4,movie.propertySizePosition-movie.offset);body.writeInt32LE(next.length,movie.arrayPosition-movie.offset);
  const result=Buffer.concat([bytes,body]);result.writeInt32LE(movie.size+delta,movie.sizePosition);result.writeInt32LE(bytes.length,movie.offsetPosition);rootMovie(result,objectName);return result;
}
module.exports={patch,rootMovie,tags,embed};
