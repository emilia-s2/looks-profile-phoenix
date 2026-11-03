'use strict';
// A mild unsharp mask after resizing; alpha, flat colors and dimensions are retained.
// Leave already-small source crops untouched instead of sharpening enlargement artifacts.
function portraitSharpness(data, width, height) {
  if (!(data instanceof Uint8ClampedArray) || data.length !== width*height*4 || width<1 || height<1 || width>64 || height>64) throw Error('Pixels de retrato inválidos.');
  const result = new Uint8ClampedArray(data), weights=[1,2,1];
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const at=(y*width+x)*4;
    if(data[at+3]!==255)continue;
    let blurred=[0,0,0], opaque=true;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++) {
      const n=(Math.max(0,Math.min(height-1,y+dy))*width+Math.max(0,Math.min(width-1,x+dx)))*4;
      if(data[n+3]!==255)opaque=false;
      const weight=weights[dy+1]*weights[dx+1];
      for(let c=0;c<3;c++)blurred[c]+=data[n+c]*weight/16;
    }
    if(!opaque)continue;
    for(let c=0;c<3;c++) {
      const detail=data[at+c]-blurred[c];
      // Ignore tiny differences/noise; cap edge correction to avoid bright/dark halos.
      if(Math.abs(detail)>=3)result[at+c]=data[at+c]+Math.max(-10,Math.min(10,detail*0.35));
    }
  }
  return result;
}
if(typeof module!=='undefined')module.exports=portraitSharpness;
if(typeof window!=='undefined')window.portraitSharpness=portraitSharpness;
