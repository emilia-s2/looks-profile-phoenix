'use strict';
// Opens the existing panel; no client package or profile is changed.
module.exports = function registerGuiShortcut(mod, open) {
    if (!global.TeraProxy || !global.TeraProxy.GUIMode) return () => {};
    let electron;
    try { electron = require('electron'); } catch (_) { return () => {}; }
    const { app, globalShortcut } = electron;
    const key = 'Control+Alt+L';
    let disposed = false, owned = false, warned = false;
    function warning(message) { if (!warned && typeof mod.warn === 'function') mod.warn(message); warned = true; }
    function invoke() {
        if (disposed) return;
        try { open(); } catch (error) { if (typeof mod.warn === 'function') mod.warn('Looks Profile: não foi possível abrir a GUI: ' + error.message); }
    }
    function ensure() {
        if (disposed || !app.isReady()) return;
        try {
            if (globalShortcut.isRegistered(key)) return;
            owned = globalShortcut.register(key, invoke);
            if (!owned) warning('Looks Profile: Ctrl+Alt+L já está em uso. A GUI continua disponível por /8 lookprofile.');
            else warned = false;
        } catch (error) { warning('Looks Profile: atalho indisponível: ' + error.message); }
    }
    app.once('ready', ensure);
    ensure();
    // Unicast may unregister every shortcut when unloading a connection.
    const timer = setInterval(ensure, 2500);
    if (timer.unref) timer.unref();
    return () => {
        disposed = true;
        clearInterval(timer);
        app.removeListener('ready', ensure);
        if (owned) { try { globalShortcut.unregister(key); } catch (_) {} }
    };
};
