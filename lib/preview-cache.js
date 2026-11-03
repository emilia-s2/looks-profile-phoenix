'use strict';

const fs = require('fs');
const path = require('path');

// GPKManager may keep a symlink to the FIRST package shared by multiple clients.
// Retain all owned packages while any owner is alive, even after a mod reload.
module.exports = function createCache(root) {
  const directory = path.join(root, 'preview-cache');
  const ownedName = /^profile-pid-([1-9][0-9]*)-[a-f0-9]{32}\.gpk$/;
  let timer = null;

  function validPid(pid) {
    return Number.isInteger(pid) && pid > 0 && pid <= 0xffffffff;
  }

  function checkDirectory(create) {
    if (create) fs.mkdirSync(directory, { recursive: true });
    if (!fs.existsSync(directory)) return false;
    const stat = fs.lstatSync(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink() ||
        fs.realpathSync(directory).toLowerCase() !== path.join(fs.realpathSync(root), 'preview-cache').toLowerCase())
      throw Error('A pasta de cache deve ser uma pasta local do mod.');
    return true;
  }

  function alive(pid) {
    // Signal zero only checks existence; it never terminates the process.
    try { process.kill(pid, 0); return true; }
    catch (error) { return error.code !== 'ESRCH'; }
  }

  function cleanup() {
    if (!checkDirectory(false)) return 0;
    const owned = [];
    for (const name of fs.readdirSync(directory)) {
      const match = ownedName.exec(name);
      if (!match || !validPid(Number(match[1]))) continue;
      const file = path.join(directory, name);
      const stat = fs.lstatSync(file);
      if (stat.isFile() && !stat.isSymbolicLink()) owned.push({ file, pid: Number(match[1]) });
    }
    if (owned.some(entry => alive(entry.pid))) return owned.length;
    let remaining = 0;
    for (const entry of owned) {
      try { fs.unlinkSync(entry.file); }
      catch (error) { if (error.code !== 'ENOENT') remaining++; }
    }
    return remaining;
  }

  function sweep() {
    try {
      if (cleanup() === 0 && timer) { clearInterval(timer); timer = null; }
    } catch (_) { /* Preserve files on access errors; retry on the next sweep. */ }
  }

  function monitor() {
    if (timer) return;
    timer = setInterval(sweep, 30000);
    // Closing Toolbox must not be delayed by cache maintenance.
    timer.unref();
  }

  function resume() {
    if (cleanup() > 0) monitor();
  }

  function write(pid, token, bytes) {
    if (!validPid(pid) || typeof token !== 'string' || !/^[a-f0-9]{32}$/.test(token))
      throw Error('Identificacao invalida para o cache do cliente.');
    checkDirectory(true);
    const file = path.join(directory, `profile-pid-${pid}-${token}.gpk`);
    try { fs.writeFileSync(file, bytes, { flag: 'wx' }); }
    finally { monitor(); }
    return file;
  }

  return { resume, write };
};
