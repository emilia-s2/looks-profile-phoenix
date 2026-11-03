'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const root = path.join(__dirname, '..');
const cache = require('./preview-cache')(root);
const reportFile = path.join(root, 'ui-test-report.json');
const resource = path.join(root, 'resources', 'creator-profile.gpk.gz');
const baselineHash = '7c78fd926ed73064756f907b0adc5f398afcebd8c49b874d102b7ddffb7bc0aa';
const catalog = require('./catalog');
const Locale = require('./i18n');
const PortraitPackage = require('./portrait-package');
const Phoenix = require('./phoenix-package');
function readSmall(file) {
  if (!fs.existsSync(file)) return null;
  if (fs.statSync(file).size > 16384) throw Error('Arquivo de controle excede o limite.');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Small bounded history links later crashes to the exact client PID/profile.
// Logging failure must never interrupt an otherwise successful installation.
function history(value) {
  try {
    const file = path.join(root, 'activation-history.jsonl');
    const previous = fs.existsSync(file) && fs.statSync(file).size <= 65536 ? fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean) : [];
    const line = JSON.stringify(value);
    if (line.length > 1800) return;
    fs.writeFileSync(file, previous.slice(-31).concat(line).join('\n') + '\n');
  } catch (_) {}
}

function write(file, value) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(tmp, file);
  if (file === reportFile) history(value);
}

function clientRoot(info) {
  if (!info || typeof info.path !== 'string' || !path.isAbsolute(info.path))
    throw Error('O Toolbox não informou a pasta do cliente.');
  // Same layout used by tera-client-interface/GPKManager: info.path is Binaries.
  return fs.realpathSync(path.resolve(info.path, '..'));
}

function samePath(a, b) { return typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase(); }
function hash(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

function readResource() {
  if (!fs.existsSync(resource) || fs.statSync(resource).size !== 1593289)
    throw Error('O pacote compactado nao corresponde ao arquivo verificado.');
  const compressed = fs.readFileSync(resource);
  if (hash(compressed) !== 'da750f825a3e33284d0ee0db0dccbf39670399c6a46da39c9d3cda1ed090fafc')
    throw Error('O pacote compactado foi alterado.');
  const bytes = zlib.gunzipSync(compressed);
  if (bytes.length !== 8334445 || hash(bytes) !== baselineHash)
    throw Error('O pacote descompactado nao corresponde a interface verificada.');
  return bytes;
}

function validateClient(info, gameRoot) {
  if (info.arch !== 'x64' || info.majorPatchVersion !== 100 || info.minorPatchVersion !== 2)
    throw Error('Este teste exige o cliente x64 100.2 que foi analisado.');
  const original=Phoenix.readClient(gameRoot);return {original,baseline:Phoenix.build(readResource(),original)};
}

function describe(mod) {
  const t = (text, params) => Locale.t(Locale.resolve(mod), text, params);
  const report = readSmall(reportFile);
  const info = mod.clientInterface && mod.clientInterface.info;
  const current = report && info && report.pid === info.pid && samePath(report.gameRoot, clientRoot(info));
  if (!current) return t('Catálogo disponível na próxima abertura do TERA. Nenhuma aplicação automática.');
  if (report.state === 'registered') {
    if (report.profileId) return t('Esta abertura ainda usa uma interface antiga. Reabra o TERA para retirar a aplicação automática.');
    return t('Catálogo registrado: {count} perfis. Nenhuma aplicação automática. Escolha em Customize → Presets.', {count: report.catalogCount});
  }
  if (report.installAttempted) return t('Falha no registro: {error}. Reabra somente o TERA antes de tentar novamente.', {error: report.error});
  return t('Catálogo não instalado: {error}.', {error: report.error || report.state});
}

class ClientMod {
  constructor(mod) {
    this.mod = mod;
    require('./preferences').clean(mod, root);
    if(fs.existsSync(path.join(root,'inspect-customizer.once')))setImmediate(()=>require('./inspect-customizer-data')(mod,root).catch(error=>mod.warn('Looks Profile: consulta local de customização: '+error.message))); 
    try { cache.resume(); } catch (error) { mod.warn('Looks Profile: cache preservado: ' + error.message); }
  }
  async install(installer) {
    let gameRoot;
    let installAttempted = false;
    const info = this.mod.clientInterface.info;
    try {
      gameRoot = clientRoot(info);
      // Never replace a package that this process may already have loaded.
      const previous = readSmall(reportFile);
      if (previous && previous.pid === info.pid && samePath(previous.gameRoot, gameRoot) &&
          (previous.state === 'registered' || previous.installAttempted)) {
        this.mod.log('Looks Profile: catálogo já registrado neste processo. Reabra somente o TERA para atualizar a lista.');
        return;
      }
      const {original,baseline} = validateClient(info, gameRoot);
      const collection = catalog.read(path.join(root, 'profiles'));
      for (const warning of collection.warnings) this.mod.warn('Looks Profile: perfil ignorado: ' + warning);
      if (!collection.entries.length) {
        write(reportFile, { state: 'empty-catalog', version: '1.3.4', gameRoot, pid: info.pid, time: Date.now() });
        this.mod.log('Looks Profile: nenhum perfil válido para o catálogo.');
        return;
      }
      const compatibility=await require('./appearance-compatibility').adapt(this.mod,collection.entries);
      for(const warning of compatibility.warnings)this.mod.warn('Looks Profile: '+warning);
      let patched = catalog.patch(baseline, compatibility.entries);
      try { patched = PortraitPackage.patch(patched, compatibility.entries, root, message => this.mod.warn('Looks Profile: ' + message), Phoenix.OBJECT); }
      catch (error) { this.mod.warn('Looks Profile: retratos indisponíveis; mantendo presets de texto: ' + error.message); }
      patched=Phoenix.overlay(original,patched);
      if(typeof this.mod.clientInterface.installResourceOverlay!=='function')throw Error('Este Phoenix exige o adaptador de recursos atualizado do Toolbox Classic.');
      const token = crypto.randomBytes(16).toString('hex');
      const previewPath = cache.write(info.pid, token, patched);
      installAttempted = true;
      await this.mod.clientInterface.installResourceOverlay(previewPath);
      write(reportFile, { state: 'registered', version: '1.3.4', activationRevision: 9, token,
        gameRoot, pid: info.pid, hash: hash(patched), profileId: null, catalogCount: collection.entries.length,
        appearanceCompatibility: compatibility.converted, source: 'phoenix-creator-file-overlay', resourceIdentity: Phoenix.UID, installationIdentity: Phoenix.installationIdentity, verification: 'awaiting-in-game', time: Date.now() });
      this.mod.log('Looks Profile Phoenix: pacote com ' + collection.entries.length + ' perfis enviado para instalação. A exibição no criador ainda precisa ser confirmada.');
    } catch (error) {
      const message = String(error.message || error);
      try { write(reportFile, { state: 'failed', version: '1.3.4', gameRoot, pid: info.pid, error: message, installAttempted, time: Date.now() }); } catch (_) {}
      this.mod.warn(installAttempted ? 'Looks Profile: falha no registro; reabra somente o TERA. ' + message : 'Looks Profile: catálogo não instalado: ' + message);
    }
  }
}
module.exports = { describe, ClientMod };
