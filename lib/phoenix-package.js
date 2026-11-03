'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const PortraitPackage=require('./portrait-package');
const PACKAGE='c7a706fb_c3e7978_1d737';
const OBJECT='CreateCharacter_dup';
const INSTALL_OBJECT='CreateCharacter';
const UID=PACKAGE+'.'+OBJECT;
const SOURCE_HASH='a65f8bc9f4b74207213ae3a035cdace5e7b62ad4bbd3c505c10df1aa001eef2c';
const TEMPLATE_HASH='7c78fd926ed73064756f907b0adc5f398afcebd8c49b874d102b7ddffb7bc0aa';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');

// Mapper decoding only. Original client maps are never written by this module.
function decodeMapper(input){
 if(!Buffer.isBuffer(input)||input.length<16||input.length>64*1024*1024)throw Error('Mapa do cliente inválido.');
 const b=Buffer.from(input),order=[12,6,9,4,3,14,1,10,13,2,7,15,0,8,5,11];
 for(let offset=0;offset+16<=b.length;offset+=16){const block=Buffer.from(b.subarray(offset,offset+16));for(let n=0;n<16;n++)b[offset+n]=block[order[n]];}
 for(let n=Math.floor((Math.floor(b.length/2)+1)/2),a=1,z=b.length-1;n>0;n--,a+=2,z-=2){const v=b[a];b[a]=b[z];b[z]=v;}
 const key=Buffer.from('GeneratePackageMapper');for(let n=0;n<b.length;n++)b[n]^=key[n%key.length];
 const text=b.toString('utf8');if(!Buffer.from(text,'utf8').equals(b)||text.includes('\0'))throw Error('Codificação de mapa não suportada.');
 return text;
}
function readBounded(file,max){const fd=fs.openSync(file,'r');try{const size=fs.fstatSync(fd).size;if(size<1||size>max)throw Error('Arquivo do cliente fora do limite.');const b=Buffer.alloc(size);let n=0;while(n<size){const read=fs.readSync(fd,b,n,size-n,n);if(!read)throw Error('Leitura incompleta do cliente.');n+=read;}return b;}finally{fs.closeSync(fd);}}
function readClient(gameRoot){
 const cooked=path.join(gameRoot,'S1Game','CookedPC');
 const pm=decodeMapper(readBounded(path.join(cooked,'PkgMapper.dat'),64*1024*1024));
 const targets=pm.split('|').filter(row=>row.split(',')[0]==='S1UI_CreateCharacter.CreateCharacter');
 if(targets.length!==1||targets[0]!=='S1UI_CreateCharacter.CreateCharacter,'+UID)throw Error('Mapeamento do criador Phoenix não reconhecido.');
 const cpm=decodeMapper(readBounded(path.join(cooked,'CompositePackageMapper.dat'),64*1024*1024));
 const matches=[];
 for(const group of cpm.split('!')){const q=group.indexOf('?');if(q<0)continue;for(const row of group.slice(q+1).split('|'))if(row.split(',')[0]===UID)matches.push({container:group.slice(0,q),row});}
 if(matches.length!==1||matches[0].container!=='e1e00001_7'||matches[0].row!==UID+','+PACKAGE+',0,7950937,')throw Error('O recurso ativo não é a interface Phoenix verificada.');
 const bytes=readBounded(path.join(cooked,'e1e00001_7.gpk'),16*1024*1024);
 if(bytes.length!==7950937||hash(bytes)!==SOURCE_HASH)throw Error('A interface Phoenix foi atualizada ou modificada. Catálogo não instalado.');
 return bytes;
}
// AVM1 function bodies follow their action headers, outside the action length.
// Walk only top-level records so a nested lpByte cannot be mistaken for the extension.
function actions(bytes){
 const result=[];let p=0;
 while(p<bytes.length){const start=p,op=bytes[p++];let payload=p,length=0;
  if(op>=128){if(p+2>bytes.length)throw Error('Ação truncada.');length=bytes.readUInt16LE(p);p+=2;payload=p;}
  let end=payload+length;if(end>bytes.length)throw Error('Ação fora do limite.');
  let name=null;
  if(op===0x8e||op===0x9b){const zero=bytes.indexOf(0,payload);if(zero<payload||zero>=end-2)throw Error('Função inválida.');name=bytes.toString('utf8',payload,zero);end+=bytes.readUInt16LE(end-2);if(end>bytes.length)throw Error('Função truncada.');}
  // No top-level with/try blocks are expected in the pinned template.
  if(op===0x94||op===0x8f)throw Error('Bloco AVM1 não suportado.');
  result.push({start,payload,end,op,name});p=end;
  if(op===0){if(p!==bytes.length)throw Error('Dados depois do fim das ações.');break;}
 }
 if(!result.length||result[result.length-1].op!==0)throw Error('Ações sem terminador.');
 return result;
}
function actionTag(body){const b=Buffer.alloc(6);b.writeUInt16LE((12<<6)|63);b.writeUInt32LE(body.length,2);return Buffer.concat([b,body]);}
// Convert only the movie's composite export name to its public logical name.
// Compact the existing name table into its existing allocation: no export,
// import, texture, or absolute mip offset moves and no table index changes.
function logicalName(bytes){
 const b=Buffer.from(bytes);let p=12;const folderLength=b.readInt32LE(p);p+=4+Math.abs(folderLength)*(folderLength>0?1:2)+4;
 const count=b.readInt32LE(p),offset=b.readInt32LE(p+4);p=offset;let found=null;
 for(let i=0;i<count;i++){const start=p,n=b.readInt32LE(p);if(n<1||n>65536)throw Error('Tabela de nomes Phoenix inesperada.');p+=4;const name=b.toString('latin1',p,p+n-1);p+=n+8;if(p>b.length)throw Error('Tabela de nomes truncada.');if(name===OBJECT){if(found)throw Error('Nome composto repetido.');found={start,end:p,n};}}
 if(!found)throw Error('Nome composto ausente.');
 const name=Buffer.from(INSTALL_OBJECT+'\0','latin1'),delta=found.n-name.length;
 if(delta!==4)throw Error('Tamanho do nome inesperado.');
 const length=Buffer.alloc(4);length.writeInt32LE(name.length);
 const table=Buffer.concat([b.subarray(offset,found.start),length,name,b.subarray(found.end-8,p)]);
 if(table.length!==p-offset-delta)throw Error('Tamanho de tabela inválido.');
 table.copy(b,offset);b.fill(0,offset+table.length,p);
 return b;
}
function build(template,phoenix){
 if(hash(template)!==TEMPLATE_HASH||hash(phoenix)!==SOURCE_HASH)throw Error('Recursos de entrada não conferem.');
 const tm=PortraitPackage.rootMovie(template),pm=PortraitPackage.rootMovie(phoenix,OBJECT);
 const original=phoenix.subarray(pm.gfxPosition,pm.gfxPosition+pm.gfxLength);
 const donor=template.subarray(tm.gfxPosition,tm.gfxPosition+tm.gfxLength);
 const code=PortraitPackage.tags(donor).filter(t=>t.type===12);
 if(code.length!==2)throw Error('Extensão do catálogo incompatível.');
 const main=donor.subarray(code[0].payload,code[0].end),records=actions(main);
 const starts=records.filter(r=>r.name==='lpByte'),pools=records.filter(r=>r.op===0x88);
 if(starts.length!==1||pools.length!==1||pools[0].start!==0||pools[0].end>starts[0].start)throw Error('Limite da extensão não reconhecido.');
 const tail=records.filter(r=>r.start>=starts[0].start&&r.name);
 if(tail.length!==20||tail.some(r=>!r.name.startsWith('lp')))throw Error('Funções inesperadas na extensão.');
 const extension=Buffer.concat([main.subarray(pools[0].start,pools[0].end),main.subarray(starts[0].start)]);
 actions(extension);actions(donor.subarray(code[1].payload,code[1].end));
 const tags=PortraitPackage.tags(original),frames=tags.filter(t=>t.type===1);
 if(frames.length!==1||original.includes(Buffer.from('LPC1|')))throw Error('Interface Phoenix já modificada.');
 const idActions=readBounded(path.join(__dirname,'../resources/phoenix-id-actions.bin'),4096);
 if(hash(idActions)!=='5d283abfd9b0bdd4ae4c6aa8b3d7baa5ef07631bbd84957d7c37efc28cd2dcfe')throw Error('Phoenix ID adapter changed');
 const idFunctions=actions(idActions).filter(record=>record.name);
 if(idFunctions.length!==1||idFunctions[0].name!=='lpBaseId')throw Error('Unexpected Phoenix ID adapter');
 const frame=frames[0];
 const gfx=Buffer.concat([original.subarray(0,frame.start),actionTag(extension),donor.subarray(code[1].start,code[1].end),actionTag(idActions),original.subarray(frame.start)]);
 gfx.writeUInt32LE(gfx.length,4);PortraitPackage.tags(gfx);
 const body=Buffer.concat([phoenix.subarray(pm.offset,pm.gfxPosition),gfx,phoenix.subarray(pm.gfxPosition+pm.gfxLength,pm.offset+pm.size)]);
 body.writeInt32LE(gfx.length+4,pm.propertySizePosition-pm.offset);body.writeInt32LE(gfx.length,pm.arrayPosition-pm.offset);
 const result=Buffer.concat([phoenix,body]);result.writeInt32LE(body.length,pm.sizePosition);result.writeInt32LE(phoenix.length,pm.offsetPosition);
 PortraitPackage.rootMovie(result,OBJECT);
 if(result.indexOf('LPC1|')<0||result.indexOf('LPC1|')!==result.lastIndexOf('LPC1|'))throw Error('Reserva do catálogo ambígua.');
 const installed=logicalName(result);
 PortraitPackage.rootMovie(installed,INSTALL_OBJECT);
 return installed;
}

function overlay(original,patched){
 if(hash(original)!==SOURCE_HASH)throw Error('Phoenix source changed');
 const base=PortraitPackage.rootMovie(original,OBJECT),movie=PortraitPackage.rootMovie(patched,INSTALL_OBJECT);
 const gfx=patched.subarray(movie.gfxPosition,movie.gfxPosition+movie.gfxLength);
 const zlib=require('zlib'),header=Buffer.from(gfx.subarray(0,8));header.write('CFX',0,'ascii');
 const compressed=Buffer.concat([header,zlib.deflateSync(gfx.subarray(8),{level:9})]);
 if(compressed.length>base.gfxLength)throw Error('O catálogo e os retratos excedem o espaço da interface Phoenix. Nenhum perfil foi removido.');
 const roundTrip=Buffer.concat([Buffer.from(gfx.subarray(0,8)),zlib.inflateSync(compressed.subarray(8))]);
 if(!roundTrip.equals(gfx))throw Error('Compression round-trip failed');
 const body=Buffer.concat([original.subarray(base.offset,base.gfxPosition),compressed,original.subarray(base.gfxPosition+base.gfxLength,base.offset+base.size)]);
 body.writeInt32LE(compressed.length+4,base.propertySizePosition-base.offset);body.writeInt32LE(compressed.length,base.arrayPosition-base.offset);
 const result=Buffer.from(original);result.fill(0,base.offset,base.offset+base.size);body.copy(result,base.offset);
 if(result.length!==7950937||!result.subarray(0,base.offset).equals(original.subarray(0,base.offset))||!result.subarray(base.offset+base.size).equals(original.subarray(base.offset+base.size)))throw Error('Composite footprint changed');
 PortraitPackage.rootMovie(result,OBJECT);return result;
}
module.exports={overlay,readClient,build,decodeMapper,actions,logicalName,OBJECT:INSTALL_OBJECT,SOURCE_OBJECT:OBJECT,UID,installationIdentity:'S1UI_CreateCharacter.CreateCharacter',filename:'S1UI_CreateCharacter.gpk',SOURCE_HASH};
