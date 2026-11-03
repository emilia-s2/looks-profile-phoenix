'use strict';

const fs = require('fs');
const path = require('path');
const { validateProfile } = require('./profile');
const CAPACITY = 32768;
const MAX_PROFILES = 64;
const MARKER = Buffer.from('LPC1|');

function payload(profile) {
  const error = validateProfile(profile);
  if (error) throw Error(error);
  const a = profile.appearance;
  const field = value => {
    if (!Number.isInteger(value) || value < 0 || value > 255) throw Error('Campo de aparencia invalido.');
    return String(value).padStart(3, '0');
  };
  return 'LPM2|' + [profile.race, profile.gender, a.faceStyle, a.hairStyle, a.skinColor,
    a.hairColor, a.faceDecal, a.tattoos, a.voice].map(field).join('|') + '|' + profile.details.map(field).join(',');
}

function read(directory) {
  const entries = [], warnings = [];
  if (!fs.existsSync(directory)) return { entries, warnings };
  for (const name of fs.readdirSync(directory).sort()) {
    if (!/^[a-z0-9_-]{1,100}\.json$/.test(name)) continue;
    try {
      const file = path.join(directory, name);
      if (!fs.statSync(file).isFile() || fs.statSync(file).size > 65536) throw Error('Tamanho de perfil invalido.');
      const profile = JSON.parse(fs.readFileSync(file, 'utf8'));
      payload(profile);
      if (typeof profile.profileName !== 'string' || profile.profileName.length > 48) throw Error('Nome excede 48 caracteres.');
      entries.push({ id: name.slice(0, -5), profile });
    } catch (error) { warnings.push(name + ': ' + error.message); }
  }
  if (entries.length > MAX_PROFILES) throw Error('Catalogo excede ' + MAX_PROFILES + ' perfis. Nenhum perfil foi apagado.');
  return { entries, warnings };
}

function serialize(entries) {
  if (entries.length > MAX_PROFILES) throw Error('Catalogo excede o limite de perfis.');
  // A zero index makes every saved preset manual, even for legacy callers.
  let text = 'LPC1|000|' + String(entries.length).padStart(3, '0') + '\n';
  for (const entry of entries) {
    const name = entry.profile.profileName;
    if (typeof name !== 'string' || !name.trim() || name.length > 48) throw Error('Nome de perfil invalido.');
    let hex = '';
    for (let n = 0; n < name.length; n++) hex += name.charCodeAt(n).toString(16).padStart(4, '0');
    text += hex + '~' + payload(entry.profile) + '\n';
  }
  if (Buffer.byteLength(text, 'ascii') > CAPACITY) throw Error('Catalogo excede a reserva da interface.');
  return Buffer.from(text.padEnd(CAPACITY, ' '), 'ascii');
}

function patch(bytes, entries) {
  const offset = bytes.indexOf(MARKER);
  if (offset < 0 || bytes.indexOf(MARKER, offset + MARKER.length) >= 0 || bytes.indexOf(0, offset) !== offset + CAPACITY)
    throw Error('Reserva do catalogo nao corresponde a interface verificada.');
  const result = Buffer.from(bytes);
  serialize(entries).copy(result, offset);
  return result;
}

module.exports = { read, payload, serialize, patch, CAPACITY, MAX_PROFILES };
