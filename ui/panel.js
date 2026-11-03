'use strict';
const Renderer = require('tera-mod-ui').Renderer;
const bridge = new Renderer();
const $ = id => document.getElementById(id);
const t = (text, params) => UIText.t(text, params);
let state = null;
let busy = false;
let draftPortrait = null;
let confirmation = null;
let otherTarget = '';
function sourceDetails() {
    const other = $('source-mode').value === 'other';
    $('target-row').hidden = !other;
    if (!other) SourcePicker.close();
    $('target').required = other;
    $('self-hint').hidden = other;
    $('source-mode').setAttribute('aria-describedby', other ? 'other-source-help' : 'self-hint');
    $('self-hint').textContent = state && state.selfName && state.canUpdate
        ? t('Será salva a aparência de {name}.', {name: state.selfName})
        : t('Entre no mundo com o personagem que deseja salvar.');
}
function portraitDetails(prefix,portrait){
    const image=$(prefix+'-icon'),hasPortrait=!!portrait,label=t(hasPortrait?'Trocar retrato':'Adicionar retrato');
    image.hidden=!hasPortrait;$(prefix+'-empty').hidden=hasPortrait;
    if(hasPortrait)image.src=portrait;else image.removeAttribute('src');
    $(prefix+'-portrait').setAttribute('aria-label',label);
    $(prefix==='profile'?'edit-icon':'new-icon').textContent=label;
}
function draftDetails(){portraitDetails('draft',draftPortrait);$('clear-icon').hidden=!draftPortrait;}
function clearDraft(){draftPortrait=null;draftDetails();}
function send(action, payload = {}) {
    if (busy) return;
    busy = true;
    document.querySelectorAll('.action').forEach(button => { button.disabled = true; });
    $('feedback').textContent = t('Executando…');
    $('language').disabled = true;
    bridge.send('action', action, payload);
}
function selectionDetails() {
    const profile = state && state.profiles.find(p => p.id === $('profile').value);
    $('profile-detail').textContent = profile ? t('Origem: {source} · {race}, {gender}', profile) : t('Salve um perfil na outra aba ou atualize a lista.');
    $('edit-icon').disabled = busy || !profile;
    $('profile-portrait').disabled = busy || !profile;
    $('delete-profile').disabled = busy || !profile;
    $('update-profile').disabled = busy || !profile || !state.canUpdate;
    $('saved-portrait-help').textContent = t(profile ? 'O retrato será usado no botão deste preset no criador.' : 'Escolha um perfil na lista abaixo para adicionar ou trocar o retrato.');
    $('update-source-help').textContent = state && state.canUpdate && state.selfName
        ? t('Será usada a aparência de {name}. O nome e o retrato do perfil serão mantidos.', {name:state.selfName})
        : t('Entre no mundo com o personagem que deseja usar na atualização.');
    portraitDetails('profile',profile&&profile.portrait);
}
bridge.on('state', value => {
    state = value;
    UIText.apply(value.language);
    if (window.PortraitEditor) PortraitEditor.refreshLanguage();
    $('language').value = value.languagePreference;
    $('language').disabled = false;
    $('language-auto').textContent = t('Automático: {language}', {language: UIText.names[value.language]});
    busy = false;
    const previous = $('profile').value;
    const reopening = $('profile').dataset.epoch !== String(value.selectionEpoch);
    $('profile').textContent = '';
    const placeholder = document.createElement('option');placeholder.value = '';placeholder.textContent = t('Selecione um perfil salvo');$('profile').appendChild(placeholder);
    for (const profile of value.profiles) {
        const option = document.createElement('option');option.value = profile.id;option.textContent = `${profile.name} — ${profile.source} (${profile.race}, ${profile.gender})`;$('profile').appendChild(option);
    }
    $('profile').value = !reopening && value.profiles.some(p => p.id === previous) ? previous : '';
    $('profile').dataset.epoch = String(value.selectionEpoch);
    $('count').textContent = `(${value.profiles.length})`;
    $('version').textContent = 'v' + value.version;
    const count = value.profiles.length;
    $('catalog-title').textContent = count ? t(count === 1 ? '{count} perfil salvo' : '{count} perfis salvos', {count}) : t('Salve seu primeiro perfil');
    $('catalog-badge').textContent = t(count ? 'Catálogo' : 'Vazio');
    $('catalog-badge').className = 'badge ' + (count ? 'on' : '');
    $('session-status').textContent = value.status;
    $('feedback').textContent = value.feedback.length ? value.feedback[value.feedback.length - 1] : t('Pronto. Escolha uma ação na janela.');
    $('messages').textContent = '';
    for (const message of value.feedback) { const li = document.createElement('li');li.textContent = message;$('messages').appendChild(li); }
    SourcePicker.setNames(value.sources);
    sourceDetails();
    document.querySelectorAll('.action').forEach(button => { button.disabled = false; });
    selectionDetails();draftDetails();
});
$('profile').addEventListener('change', selectionDetails);
$('language').addEventListener('change', () => send('language', {language: $('language').value}));
$('reload').addEventListener('click', () => send('reload'));
$('status').addEventListener('click', () => send('status'));
$('save-form').addEventListener('submit', event => { event.preventDefault();send('save', { target: $('target').value, name: $('profile-name').value, portrait: draftPortrait }); });
const tabs = Array.from(document.querySelectorAll('[data-tab]'));
function activate(tab) { SourcePicker.close(); for (const button of tabs) { const active = button === tab;button.setAttribute('aria-selected', String(active));button.tabIndex = active ? 0 : -1;$(button.dataset.tab).hidden = !active; } }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => activate(tab));tab.addEventListener('keydown', event => { if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;event.preventDefault();const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];activate(next);next.focus(); }); });
activate(tabs[0]);
window.addEventListener('beforeunload', () => bridge.destructor());

$('new-icon').onclick=async()=>{if(busy)return;const source=$('target').value;const png=await PortraitEditor.open('Retrato do novo perfil');if(png&&source===$('target').value){draftPortrait=png;draftDetails();}};
$('edit-icon').onclick=async()=>{if(busy)return;const id=$('profile').value,profile=state.profiles.find(p=>p.id===id);if(!profile)return;const png=await PortraitEditor.open('Retrato: {name}', {name: profile.name});if(png&&id===$('profile').value)send('set-icon',{id,portrait:png});};
$('draft-portrait').onclick=()=>$('new-icon').click();$('profile-portrait').onclick=()=>$('edit-icon').click();
$('profile-icon').onerror=()=>{$('profile-icon').hidden=true;$('profile-empty').hidden=false;};$('draft-icon').onerror=()=>{$('draft-icon').hidden=true;$('draft-empty').hidden=false;};
draftDetails();
$('clear-icon').onclick=clearDraft;
$('target').addEventListener('input',()=>{otherTarget=$('target').value;clearDraft();});
$('source-mode').addEventListener('change',()=>{
    const other=$('source-mode').value==='other';
    if(other) $('target').value=otherTarget;
    else {otherTarget=$('target').value;$('target').value='self';}
    clearDraft();sourceDetails();
    if(other) $('target').focus();
});
sourceDetails();bridge.on('profile-saved',clearDraft);
function closeConfirmation(cancel) {
    const hadConfirmation = !!confirmation;
    confirmation = null;
    $('manage-dialog').close();
    if(cancel && hadConfirmation) send('cancel-profile-change');
}
$('delete-profile').onclick=()=>send('request-delete',{id:$('profile').value});
$('update-profile').onclick=()=>send('request-update',{id:$('profile').value});
bridge.on('confirm-profile-change', value=>{
    confirmation=value;
    const updating=value.kind==='update';
    $('manage-title').textContent=t(updating?'Atualizar perfil?':'Excluir perfil?');
    $('manage-description').textContent=t(updating
        ? 'Substituir a aparência de “{name}” pela de {source} ({race}, {gender})? O nome e o retrato serão mantidos. A aparência anterior será substituída.'
        : 'Excluir “{name}” e seu retrato? Essa exclusão não pode ser desfeita pela janela.',value);
    $('manage-confirm').textContent=t(updating?'Atualizar perfil':'Excluir perfil');
    $('manage-dialog').showModal();$('manage-cancel').focus();
});
$('manage-cancel').onclick=()=>closeConfirmation(true);
$('manage-dialog').addEventListener('cancel',e=>{e.preventDefault();closeConfirmation(true);});
$('manage-confirm').onclick=()=>{if(!confirmation||busy)return;const token=confirmation.token;closeConfirmation(false);send('confirm-profile-change',{token});};
bridge.send('ready');
