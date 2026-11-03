'use strict';
// Pixel coordinates refer to the original image, never the displayed canvas.
class Crop {
  constructor(width,height) {
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>8192||height>8192||width*height>24000000)throw Error('Imagem excede o limite de 24 megapixels ou 8192 pixels por lado.');
    this.width=width;this.height=height;this.side=Math.min(width,height)*0.25;
    this.x=width/2;this.y=height/2;this.clamp();
  }
  clamp() {const r=this.side/2;this.x=Math.max(r,Math.min(this.width-r,this.x));this.y=Math.max(r,Math.min(this.height-r,this.y));return this;}
  size(percent) {if(!Number.isFinite(percent)||percent<2||percent>100)throw Error('Tamanho de recorte inválido.');this.side=Math.min(this.width,this.height)*percent/100;return this.clamp();}
  move(x,y) {if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Posição de recorte inválida.');this.x=x;this.y=y;return this.clamp();}
  rect() {const width=Math.max(1,Math.min(this.width,this.height,Math.round(this.side)));return {x:Math.max(0,Math.min(this.width-width,Math.round(this.x-width/2))),y:Math.max(0,Math.min(this.height-width,Math.round(this.y-width/2))),width,height:width};}
  fromView(clientX,clientY,bounds) {if(!bounds||bounds.width<=0||bounds.height<=0)throw Error('Área de imagem inválida.');return this.move((clientX-bounds.left)*this.width/bounds.width,(clientY-bounds.top)*this.height/bounds.height);}
}
if(typeof module!=='undefined')module.exports=Crop;
if(typeof window!=='undefined')window.PortraitCrop=Crop;
