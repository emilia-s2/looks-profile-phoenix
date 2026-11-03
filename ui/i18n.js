'use strict';
window.UIText=(()=>{
  const Locale=require('../lib/i18n');
  const nodes=[],attributes=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    if(node.parentElement.closest('script,style'))continue;
    const text=node.nodeValue.trim();
    if(text)nodes.push({node,text,prefix:node.nodeValue.match(/^\s*/)[0],suffix:node.nodeValue.match(/\s*$/)[0]});
  }
  for(const element of document.querySelectorAll('[aria-label],[alt],[placeholder],[title]'))
    for(const name of ['aria-label','alt','placeholder','title'])if(element.hasAttribute(name))attributes.push({element,name,text:element.getAttribute(name)});
  let language='pt';
  function t(text,params){return Locale.t(language,text,params);}
  function apply(value){
    language=Locale.normalize(value)||'en';document.documentElement.lang={pt:'pt-BR',en:'en',es:'es-419'}[language];
    for(const item of nodes)if(item.node.isConnected)item.node.nodeValue=item.prefix+t(item.text)+item.suffix;
    for(const item of attributes)item.element.setAttribute(item.name,t(item.text));
    document.title='Looks Profile • '+t('Perfis de aparência');
  }
  return {t,apply,names:Locale.names,error:text=>Locale.error(language,text)};
})();
