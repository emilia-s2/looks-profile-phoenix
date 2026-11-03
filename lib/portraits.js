'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const LIMIT = 32768;
function safeId(id) { if (typeof id !== 'string' || !/^[a-z0-9_-]{1,100}$/.test(id)) throw Error('ID de perfil inválido.'); return id; }
function crc(bytes) { let c = 0xffffffff; for (const v of bytes) { c ^= v; for (let i=0;i<8;i++) c = (c>>>1) ^ ((c&1) ? 0xedb88320 : 0); } return (c^0xffffffff)>>>0; }
function decode(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length>LIMIT || bytes.length<45 || !bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'))) throw Error('Ícone PNG inválido.');
  let p=8,channels=0,ended=false;const data=[];
  while(p<bytes.length) {
    if(p+12>bytes.length)throw Error('PNG truncado.');
    const n=bytes.readUInt32BE(p), type=bytes.toString('ascii',p+4,p+8);
    if(n>LIMIT||p+12+n>bytes.length||crc(bytes.subarray(p+4,p+8+n))!==bytes.readUInt32BE(p+8+n))throw Error('PNG corrompido.');
    const chunk=bytes.subarray(p+8,p+8+n);
    if(p===8&&type!=='IHDR')throw Error('Cabeçalho PNG ausente.');
    if(type==='IHDR') {
      if(channels||n!==13||chunk.readUInt32BE(0)!==64||chunk.readUInt32BE(4)!==64||chunk[8]!==8||![2,6].includes(chunk[9])||chunk[10]||chunk[11]||chunk[12])throw Error('Use PNG RGB/RGBA de 64 × 64.');
      channels=chunk[9]===6?4:3;
    } else if(type==='IDAT') data.push(chunk);
    else if(type==='IEND') { if(n||p+12!==bytes.length)throw Error('Final PNG inválido.');ended=true;break; }
    else if(type[0]===type[0].toUpperCase()&&type!=='PLTE')throw Error('Formato PNG não suportado.');
    p+=12+n;
  }
  if(!ended||!channels||!data.length)throw Error('PNG incompleto.');
  const stride=64*channels, expected=(stride+1)*64;
  const raw=zlib.inflateSync(Buffer.concat(data),{maxOutputLength:expected});
  if(raw.length!==expected)throw Error('Pixels PNG inválidos.');
  const pixels=Buffer.alloc(stride*64);
  function paeth(a,b,c){const v=a+b-c,pa=Math.abs(v-a),pb=Math.abs(v-b),pc=Math.abs(v-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
  for(let y=0;y<64;y++) {
    const filter=raw[y*(stride+1)];if(filter>4)throw Error('Filtro PNG inválido.');
    for(let x=0;x<stride;x++) {
      const at=y*stride+x,a=x>=channels?pixels[at-channels]:0,b=y?pixels[at-stride]:0,c=y&&x>=channels?pixels[at-stride-channels]:0;
      const add=filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):0;
      pixels[at]=(raw[y*(stride+1)+1+x]+add)&255;
    }
  }
  const argb=Buffer.alloc(64*64*4);
  for(let n=0;n<4096;n++){const s=n*channels,d=n*4,a=channels===4?pixels[s+3]:255;argb[d]=a;for(let k=0;k<3;k++)argb[d+1+k]=Math.round(pixels[s+k]*a/255);}
  return argb;
}
function file(root,id,create=false) {
  safeId(id);const dir=path.join(root,'icons');
  if(create&&!fs.existsSync(dir))fs.mkdirSync(dir);
  if(fs.existsSync(dir)&&(!fs.lstatSync(dir).isDirectory()||fs.lstatSync(dir).isSymbolicLink()))throw Error('Pasta de ícones inválida.');
  const target=path.join(dir,id+'.png');
  if(fs.existsSync(target)&&(!fs.lstatSync(target).isFile()||fs.lstatSync(target).isSymbolicLink()))throw Error('Arquivo de ícone inválido.');
  return target;
}
function read(root,id) {
  const target=file(root,id);if(!fs.existsSync(target))return null;
  if(fs.statSync(target).size>LIMIT)throw Error('Ícone excede o limite.');
  const bytes=fs.readFileSync(target);decode(bytes);return bytes;
}
function preview(root,id) { try{const b=read(root,id);return b?'data:image/png;base64,'+b.toString('base64'):null;}catch(_){return null;} }
function save(root,id,url,nativeImage) {
  if(typeof url!=='string'||!/^data:image\/png;base64,[A-Za-z0-9+/]*={0,2}$/.test(url)||url.length>LIMIT*1.4)throw Error('Recorte de ícone inválido.');
  const input=Buffer.from(url.split(',')[1],'base64');decode(input);
  const image=(nativeImage||require('electron').nativeImage).createFromBuffer(input),size=image.getSize();
  if(image.isEmpty()||size.width!==64||size.height!==64)throw Error('Use um recorte de 64 × 64.');
  const bytes=image.toPNG();decode(bytes);
  const target=file(root,id,true),tmp=target+'.'+process.pid+'.'+Date.now()+'.tmp';
  try{fs.writeFileSync(tmp,bytes,{flag:'wx'});fs.renameSync(tmp,target);}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
  return bytes.length;
}
module.exports={decode,read,preview,save,safeId};
