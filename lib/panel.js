'use strict';
const path = require('path');
const Host = require('tera-mod-ui').Host;
const Locale = require('./i18n');

module.exports = class ProfilePanel extends Host {
    constructor(mod, getState, onAction) {
        super(mod, 'index.html', {
            title: 'Looks Profile • Perfis de aparência', width: 840, height: 940,
            minWidth: 660, minHeight: 620, resizable: true, backgroundColor: '#101820',
            autoHideMenuBar: true,
            webPreferences: { nodeIntegration: true, contextIsolation: false, devTools: false }
        }, false, path.join(__dirname, '..', 'ui'));
        this.on('ready', () => this.update(getState()));
        this.on('action', (action, payload) => onAction(action, payload));
    }
    show() {
        super.show();
        if (this.window) {
            if (this.window.isMinimized()) this.window.restore();
            this.window.show();
            this.window.focus();
        }
    }
    // IPC belongs to the renderer WebContents, whose ID need not equal BrowserWindow.id.
    _handleEvent(event, name, ...args) {
        if (this.window && event.sender === this.window.webContents && (name === 'ready' || name === 'action'))
            this.emit(name, ...args);
    }
    update(state) { if (this.window) this.window.setTitle('Looks Profile • ' + Locale.t(state.language, 'Perfis de aparência')); this.send('state', state); }
    destructor() { super.destructor(); this.removeAllListeners(); }
};
