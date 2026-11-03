'use strict';
const Locale = require('./lib/i18n');
// Toolbox calls this before NetworkMod/ClientMod when no local config exists.
module.exports = function migrateSettings(fromVersion, toVersion, settings) {
    if (toVersion !== 1) throw Error('Unsupported Looks Profile settings version: ' + toVersion);
    const data = settings && typeof settings === 'object' && !Array.isArray(settings) ? { ...settings } : {};
    delete data.selectedProfileId;
    delete data.applyNextCreate;
    delete data.profileOnNextLaunch;
    data.language = Locale.preference(data.language);
    return data;
};
