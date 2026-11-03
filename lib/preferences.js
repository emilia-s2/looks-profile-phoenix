'use strict';
const fs=require('fs'),path=require('path'),Locale=require('./i18n');
const legacyKeys=['selectedProfileId','applyNextCreate','profileOnNextLaunch'];
function read(root){
    const file=path.join(root,'config.json');
    if(!fs.existsSync(file))return {version:1,data:{}};
    if(fs.statSync(file).size>65536)throw Error('config.json excede o limite.');
    const value=JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
    if(!value||!value.data||typeof value.data!=='object'||Array.isArray(value.data))throw Error('config.json precisa ter um objeto data válido.');
    return value;
}
function write(root,value){
    const file=path.join(root,'config.json'),temporary=file+'.preferences-'+process.pid+'.tmp';
    fs.writeFileSync(temporary,JSON.stringify(value,null,2)+'\n');fs.renameSync(temporary,file);
}
function strip(data){for(const key of legacyKeys)delete data[key];}
function clean(mod,root){
    if(!mod.settings||typeof mod.settings!=='object')mod.settings={};
    strip(mod.settings);
    try{
        const value=read(root),before=JSON.stringify(value);strip(value.data);
        const chosen=Locale.preference(mod.settings.language===undefined?value.data.language:mod.settings.language);
        mod.settings.language=chosen;value.data.language=chosen;
        if(JSON.stringify(value)!==before)write(root,value);
    }catch(error){
        mod.settings.language=Locale.preference(mod.settings.language);
        const message='Looks Profile: '+Locale.error(Locale.resolve(mod),error.message);
        if(typeof mod.warn==='function')mod.warn(message);else console.warn(message);
    }
}
function setLanguage(mod,root,language){
    if(!['auto','pt','en','es'].includes(language))throw Error('Idioma inválido. Use auto, pt, en ou es.');
    const value=read(root);strip(value.data);value.data.language=language;
    write(root,value);
    strip(mod.settings);mod.settings.language=language;
}
module.exports={clean,setLanguage};
