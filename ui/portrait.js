'use strict';
// Explicit screenshot import and human framing; no game capture or face recognition.
window.PortraitEditor = (() => {
  const {clipboard}=require('electron'),$=id=>document.getElementById('portrait-'+id);
  let crop=null,image=null,revision=0,resolve=null,titleText='Retrato do perfil',titleParams={},statusText='';
  const token=()=>++revision;
  function status(text){statusText=text;$('status').textContent=UIText.error(text);} function refreshLanguage(){if($('dialog').open){$('title').textContent=UIText.t(titleText,titleParams);$('status').textContent=UIText.error(statusText);}}
  function render(){
    if(!crop||!image)return;
    const canvas=$('image'),ctx=canvas.getContext('2d'),scale=Math.min(640/crop.width,340/crop.height,1);
    canvas.width=Math.max(1,Math.round(crop.width*scale));canvas.height=Math.max(1,Math.round(crop.height*scale));ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const r=crop.rect(),sx=canvas.width/crop.width,sy=canvas.height/crop.height;
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.rect(0,0,canvas.width,canvas.height);ctx.rect(r.x*sx,r.y*sy,r.width*sx,r.height*sy);ctx.fill('evenodd');ctx.strokeStyle='#8cfff0';ctx.lineWidth=2;ctx.strokeRect(r.x*sx,r.y*sy,r.width*sx,r.height*sy);
    const c=$('preview').getContext('2d');c.clearRect(0,0,64,64);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(image,r.x,r.y,r.width,r.height,0,0,64,64);
    if($('sharp').checked && r.width>64) { const pixels=c.getImageData(0,0,64,64); pixels.data.set(portraitSharpness(pixels.data,64,64)); c.putImageData(pixels,0,0); }
    $('editor').hidden=false;$('use').disabled=false;
  }
  async function loadImage(url,request=token()){
    if(typeof url!=='string'||!/^data:image\/(png|jpeg);base64,/.test(url)||url.length>22500000)throw Error('Escolha PNG ou JPEG de até 16 MB.');
    const candidate=new Image();await new Promise((ok,no)=>{candidate.onload=ok;candidate.onerror=()=>no(Error('Não foi possível abrir a imagem.'));candidate.src=url;});
    const next=new PortraitCrop(candidate.naturalWidth,candidate.naturalHeight);
    if(request!==revision||!$('dialog').open)return false;
    image=candidate;crop=next;$('size').value=25;render();status('Clique no rosto e ajuste o tamanho do quadrado. Confira a prévia antes de confirmar.');return true;
  }
  async function fileImage(file){
    if(!file||!['image/png','image/jpeg'].includes(file.type)||file.size>16*1024*1024)throw Error('Escolha PNG ou JPEG de até 16 MB.');
    const request=token(),url=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>no(Error('Não foi possível ler a imagem.'));r.readAsDataURL(file);});return loadImage(url,request);
  }
  function finish(value){token();$('dialog').close();crop=image=null;const done=resolve;resolve=null;if(done)done(value);}
  $('choose').onclick=()=>$('file').click();
  $('file').onchange=async()=>{try{await fileImage($('file').files[0]);}catch(e){status(e.message);}finally{$('file').value='';}};
  $('paste').onclick=()=>{const shot=clipboard.readImage();if(shot.isEmpty()){status('Copie uma captura como imagem antes de colar.');return;}loadImage(shot.toDataURL()).catch(e=>status(e.message));};
  document.addEventListener('paste',e=>{if(!$('dialog').open)return;const item=Array.from(e.clipboardData.items).find(i=>i.kind==='file'&&/^image\//.test(i.type));if(item){e.preventDefault();fileImage(item.getAsFile()).catch(err=>status(err.message));}});
  $('sharp').onchange=render;
  $('size').oninput=()=>{if(crop){crop.size(Number($('size').value));render();}};
  const area=$('image');function move(e){if(crop){crop.fromView(e.clientX,e.clientY,area.getBoundingClientRect());render();}}
  area.onpointerdown=e=>{if(crop){area.setPointerCapture(e.pointerId);move(e);}};
  area.onpointermove=e=>{if(area.hasPointerCapture(e.pointerId))move(e);};
  area.onpointerup=e=>{if(area.hasPointerCapture(e.pointerId))area.releasePointerCapture(e.pointerId);};
  area.onkeydown=e=>{if(!crop)return;const d=e.shiftKey?10:1,delta={ArrowLeft:[-d,0],ArrowRight:[d,0],ArrowUp:[0,-d],ArrowDown:[0,d]}[e.key];if(delta){e.preventDefault();crop.move(crop.x+delta[0],crop.y+delta[1]);render();}};
  $('cancel').onclick=()=>finish(null);$('dialog').addEventListener('cancel',e=>{e.preventDefault();finish(null);});
  $('use').onclick=()=>{if(crop)finish($('preview').toDataURL('image/png'));};
  return {refreshLanguage,open(title,params={}){if(resolve)finish(null);token();crop=image=null;$('editor').hidden=true;$('use').disabled=true;titleText=title;titleParams=params;$('title').textContent=UIText.t(title,params);status('Escolha uma imagem PNG/JPEG do computador ou copie uma captura e use Colar captura da tela. Depois enquadre o rosto e confirme o recorte.');$('dialog').showModal();return new Promise(done=>{resolve=done;});}};
})();
