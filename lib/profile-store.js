'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const Profile = require('./profile'), {safeId} = require('./portraits');
function file(root, directory, id, extension, required) {
    safeId(id);
    const dir = path.join(root, directory), target = path.join(dir, id + extension);
    for (const [name, isDirectory] of [[dir, true], [target, false]]) {
        let stat;
        try { stat = fs.lstatSync(name); } catch (error) { if(error.code !== 'ENOENT') throw error; }
        if (stat && (stat.isSymbolicLink() || (isDirectory ? !stat.isDirectory() : !stat.isFile()))) throw Error('Caminho de perfil ou retrato inválido.');
        if (!stat && required) throw Error('O perfil não está mais disponível. Atualize a lista.');
    }
    return target;
}
function snapshot(root, id) {
    const profilePath = file(root, 'profiles', id, '.json', true);
    const iconPath = file(root, 'icons', id, '.png', false);
    if(fs.statSync(profilePath).size > 65536 || (fs.existsSync(iconPath) && fs.statSync(iconPath).size > 32768)) throw Error('Arquivo de perfil ou retrato excede o limite.');
    const bytes = fs.readFileSync(profilePath), icon = fs.existsSync(iconPath) ? fs.readFileSync(iconPath) : null;
    const profile = JSON.parse(bytes.toString('utf8'));
    if(Profile.validateProfile(profile)) throw Error('Selecione um perfil salvo válido.');
    const revision = crypto.createHash('sha256').update(bytes).update(icon ? '\0icon\0' : '\0no-icon\0');
    if(icon) revision.update(icon);
    return {profilePath, iconPath, profile, hasIcon:!!icon, revision:revision.digest('hex')};
}
function apply(root, id, expected, replacement) {
    const current = snapshot(root, id);
    if(current.revision !== expected) throw Error('O perfil ou retrato mudou. Confira a lista e tente novamente.');
    const suffix = '.' + crypto.randomBytes(12).toString('hex') + '.tmp';
    if(replacement) {
        const error = Profile.validateProfile(replacement);
        if(error) throw Error(error);
        const bytes = Buffer.from(JSON.stringify(replacement, null, 2) + '\n');
        if(bytes.length > 65536) throw Error('Arquivo de perfil ou retrato excede o limite.');
        const temporary = current.profilePath + suffix;
        try {
            fs.writeFileSync(temporary, bytes, {flag:'wx'});
            fs.renameSync(temporary, current.profilePath);
        } finally { if(fs.existsSync(temporary)) fs.unlinkSync(temporary); }
        return {cleanupPending:false};
    }
    // Stage both files before deletion. If either move fails, restore the pair.
    const moved = [];
    try {
        for(const original of [current.profilePath, ...(current.hasIcon ? [current.iconPath] : [])]) {
            const temporary = original + suffix;
            fs.renameSync(original, temporary);
            moved.push([original, temporary]);
        }
    } catch(error) {
        for(const [original, temporary] of moved.reverse()) fs.renameSync(temporary, original);
        throw error;
    }
    let cleanupPending = false;
    for(const [,temporary] of moved) {
        try { fs.unlinkSync(temporary); } catch (_) { cleanupPending = true; }
    }
    return {cleanupPending};
}
module.exports = {snapshot, apply};
