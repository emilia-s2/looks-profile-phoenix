'use strict';

const fs = require('fs');
const path = require('path');
const ProfilePanel = require('./lib/panel');
const Profile = require('./lib/profile');
const ProfileStore = require('./lib/profile-store');
const crypto = require('crypto');
const UiTest = require('./lib/ui-baseline-test');
const Portraits = require('./lib/portraits');
const Preferences = require('./lib/preferences');
const Locale = require('./lib/i18n');

module.exports = function LooksProfileManager(mod) {
	const profilesDirectory = path.join(__dirname, 'profiles');
	const playerData = new Map();
	const lobbyData = new Map();
	let selfData = null;
    let pendingChange = null;
	let profiles = new Map();
	let settingsUi = null;
	const feedback = [];
    let selectionEpoch = 0;
    Preferences.clean(mod, __dirname);

	mod.hook('S_LOGIN', mod.majorPatchVersion >= 114 ? 15 : 14, event => {
		selfData = event;
        pendingChange = null;
	});

	mod.hook('S_SPAWN_USER', mod.majorPatchVersion >= 99 ? 16 : 15, event => {
		playerData.set(event.gameId, event);
	});

	mod.hook('S_DESPAWN_USER', 3, event => {
		playerData.delete(event.gameId);
	});

	mod.hook('S_LOAD_TOPO', 'raw', () => {
		playerData.clear();
	});

	if (mod.majorPatchVersion >= 95 && mod.majorPatchVersion < 101) {
		mod.hook('S_GET_USER_LIST', 18, storeLobbyCharacters);
	} else if (mod.majorPatchVersion >= 86 && mod.majorPatchVersion < 95) {
		mod.hook('S_GET_USER_LIST', 17, storeLobbyCharacters);
	}

	mod.command.add('lookprofile', (action, ...args) => dispatch(action, args));

	function dispatch(action, args) {
		try {
		switch ((action || '').toLowerCase()) {
			case 'test-profile':
			case 'test-ui':
			case 'select':
			case 'arm':
                notify('Looks Profile: perfil padrão e preparação foram removidos. Escolha um preset em Customize → Presets.');
                break;
			case 'save': {
				const targetName = args.shift() || 'self';
				const profileName = args.join(' ').trim();
				saveProfile(targetName, profileName);
				break;
			}
			case 'disarm':
                Preferences.clean(mod, __dirname);
                selectionEpoch++;
                notify('Looks Profile: não existe mais perfil padrão ou aplicação automática. Seus presets continuam no criador.');
                break;
			case 'status':
				showStatus();
				break;
			case 'reload':
				loadProfiles();
				rebuildSettingsUi();
				notify('Looks Profile: {count} perfil(is) completo(s) carregado(s).', {count: profiles.size});
				break;
			case 'gui':
			case '':
				openSettings();
				break;
			default:
				notify('Uso: /8 lookprofile [save <personagem|self> [nome do perfil] | status | reload | gui]');
		}
		} finally { refreshSettingsUi(); }
	}

	loadProfiles();
	rebuildSettingsUi();
    const disposeGuiShortcut = require('./lib/gui-shortcut')(mod, openSettings);

	function notify(message, params = {}) {
        feedback.push({text: String(message), params});
        if (feedback.length > 6) feedback.shift();
        mod.command.message(Locale.t(Locale.resolve(mod), message, params));
    }

	function escapeHtml(value) {
		return String(value).replace(/[&<>"']/g, character => ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		})[character]);
	}

	function storeLobbyCharacters(event) {
		if (event.first)
			lobbyData.clear();
		if (!Array.isArray(event.characters))
			return;
		for (const character of event.characters) {
			if (character && typeof character.name === 'string' && character.name.length)
				lobbyData.set(character.name.toLowerCase(), character);
		}
	}

	function slugify(value) {
		return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
			.replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'perfil';
	}

	function loadProfiles() {
		profiles = new Map();
		try {
			fs.mkdirSync(profilesDirectory, { recursive: true });
			for (const filename of fs.readdirSync(profilesDirectory)) {
				if (!filename.endsWith('.json'))
					continue;
				const filePath = path.join(profilesDirectory, filename);
				try {
					const stat = fs.statSync(filePath);
					if (!stat.isFile() || stat.size > 65536)
						continue;
					const profile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
					if (Profile.validateProfile(profile))
						continue;
					profiles.set(path.basename(filename, '.json'), profile);
				} catch (error) {
					console.warn(`[looks-profile] Ignorando ${filename}: ${error.message}`);
				}
			}
		} catch (error) {
			console.error(`[looks-profile] Não foi possível ler os perfis: ${error.message}`);
		}
	}

    function plainMessage(value) {
        return String(value).replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }

    function panelState() {
        let status;
        try { status = UiTest.describe(mod); } catch (error) { status = Locale.error(Locale.resolve(mod), error.message); }
        return {
            version: '1.3.4', selectionEpoch, language: Locale.resolve(mod), languagePreference: mod.settings.language,
            profiles: Array.from(profiles, ([id, p]) => ({ id, name: p.profileName, source: p.sourceName || Locale.t(Locale.resolve(mod), 'Origem desconhecida'), race: raceName(p.race), gender: genderName(p.gender), details: p.details.length, portrait: Portraits.preview(__dirname, id) })),
            status: plainMessage(status), feedback: feedback.map(record => plainMessage(record.status ? UiTest.describe(mod) : Locale.t(Locale.resolve(mod), record.text, record.params))),
            selfName: selfData && selfData.name || '',
            canUpdate: !!(selfData && mod.game && mod.game.isIngame),
            sources: Array.from(new Set([...Array.from(lobbyData.values(), c => c.name), ...Array.from(playerData.values(), c => c.name)]))
        };
    }

    function panelAction(action, payload) {
        try {
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) payload = {};
            switch (action) {
                case 'language':
                    Preferences.setLanguage(mod, __dirname, payload.language);
                    notify('Looks Profile: idioma salvo.');
                    break;
                case 'select':
                case 'prepare':
                    throw Error('Perfil padrão e preparação foram removidos. Escolha o preset no criador.');
                case 'save': {
                    const target = typeof payload.target === 'string' ? payload.target.trim() : '';
                    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
                    if (target.length > 100 || name.length > 100) throw Error('Use até 100 caracteres por campo.');
                    const id = saveProfile(target || 'self', name, payload.portrait);
                    if(id && settingsUi) settingsUi.send('profile-saved', {id});
                    break;
                }
                case 'request-delete':
                case 'request-update': {
                    pendingChange = null;
                    if(typeof payload.id !== 'string' || !profiles.has(payload.id)) throw Error('Selecione um perfil salvo válido.');
                    const current = ProfileStore.snapshot(__dirname, payload.id);
                    const updating = action === 'request-update';
                    if(updating && !(selfData && mod.game && mod.game.isIngame)) throw Error('Entre no mundo com o personagem que deseja salvar.');
                    const replacement = updating ? Profile.createProfile(current.profile.profileName, selfData) : null;
                    const token = crypto.randomBytes(16).toString('hex');
                    pendingChange = {token, id:payload.id, revision:current.revision, replacement, source:selfData, expires:Date.now()+300000};
                    if(settingsUi) settingsUi.send('confirm-profile-change', {token, kind:updating?'update':'delete', name:current.profile.profileName,
                        source:replacement && replacement.sourceName, race:replacement && raceName(replacement.race), gender:replacement && genderName(replacement.gender)});
                    break;
                }
                case 'cancel-profile-change': pendingChange = null; break;
                case 'confirm-profile-change': {
                    const change = pendingChange; pendingChange = null;
                    if(!change || payload.token !== change.token || Date.now()>change.expires) throw Error('Confirmação expirada. Escolha o perfil novamente.');
                    if(change.replacement && (!(mod.game && mod.game.isIngame) || selfData !== change.source)) throw Error('O personagem mudou ou saiu do mundo. Tente novamente.');
                    const result = ProfileStore.apply(__dirname, change.id, change.revision, change.replacement);
                    loadProfiles();
                    notify(change.replacement ? 'Looks Profile: perfil atualizado. Nome e retrato mantidos. Reabra somente o TERA para atualizar o catálogo.' : 'Looks Profile: perfil excluído do catálogo local. Reabra somente o TERA para atualizar o criador.');
                    if(result.cleanupPending) notify('Looks Profile: restaram arquivos temporários da exclusão. Confira a pasta do mod antes de considerar a remoção completa.');
                    break;
                }
                case 'set-icon':
                    if(typeof payload.id !== 'string' || !profiles.has(payload.id)) throw Error('Selecione um perfil salvo válido.');
                    Portraits.save(__dirname, payload.id, payload.portrait);
                    notify('Looks Profile: retrato salvo. Reabra somente o TERA para atualizar o ícone no criador.');
                    break;
                case 'cancel': dispatch('disarm', []); break;
                case 'status': dispatch('status', []); break;
                case 'reload': dispatch('reload', []); break;
                default: throw Error('Ação da janela não reconhecida.');
            }
        } catch (error) { notify('Looks Profile: {error}', {error: error.message}); }
        finally { refreshSettingsUi(); }
    }

    function rebuildSettingsUi() { refreshSettingsUi(); }

    function refreshSettingsUi() {
        if (settingsUi) settingsUi.update(panelState());
    }

    function openSettings() {
        if (!global.TeraProxy || !global.TeraProxy.GUIMode) {
            notify('Looks Profile: abra o TERA Toolbox em modo gráfico para usar a janela de perfis.');
            return;
        }
        selectionEpoch++;
        if (!settingsUi) settingsUi = new ProfilePanel(mod, panelState, panelAction);
        settingsUi.show();
        refreshSettingsUi();
    }

	function raceName(race) {
		return Locale.t(Locale.resolve(mod), ['Humana', 'Elfa alta', 'Aman', 'Castanic', 'Popori/Elin', 'Baraka'][race] || 'raça {race}', {race});
	}

	function genderName(gender) {
		return Locale.t(Locale.resolve(mod), gender === 1 ? 'feminino' : 'masculino');
	}

	function chooseSource(name) {
		const normalizedName = String(name || 'self').trim().toLowerCase();	
		if (normalizedName === 'self' || (selfData && normalizedName === String(selfData.name || '').toLowerCase())) {
			if (!selfData)
				return { error: 'Dados do seu personagem ainda não chegaram. Entre no mundo uma vez ou salve um personagem da seleção.' };
			return { data: selfData };
		}

		const lobbyCharacter = lobbyData.get(normalizedName);
		if (lobbyCharacter)
			return { data: lobbyCharacter, identity: Profile.identityFromLobbyCharacter(lobbyCharacter) };

		const player = Array.from(playerData.values()).find(entry => String(entry.name || '').toLowerCase() === normalizedName);
		if (player)
			return { data: player };
		return { error: 'Não encontrei “{name}”. Use self, um personagem da seleção ou alguém que esteja visível no mapa.', params: {name: escapeHtml(name)} };
	}

	function saveProfile(targetName, requestedProfileName, portrait = null) {
		const source = chooseSource(targetName);
		if (source.error) {
			notify('Looks Profile: {error}', {error: {text: source.error, params: source.params}});
			return;
		}
		const profileName = requestedProfileName || String(source.data.name || targetName || 'Perfil').trim();
		let profile;
		try {
			profile = Profile.createProfile(profileName, source.data, source.identity || null);
		} catch (error) {
			notify('Looks Profile: perfil não salvo. {error}', {error: error.message});
			return;
		}

		try {
			fs.mkdirSync(profilesDirectory, { recursive: true });
			const baseId = `${slugify(profile.profileName)}_${Date.now()}`;
			let id = baseId;
			let suffix = 1;
			while (fs.existsSync(path.join(profilesDirectory, `${id}.json`)))
				id = `${baseId}_${suffix++}`;
			const finalPath = path.join(profilesDirectory, `${id}.json`);
			const temporaryPath = `${finalPath}.tmp`;
			fs.writeFileSync(temporaryPath, `${JSON.stringify(profile, null, 2)}\n`, { flag: 'wx' });
			fs.renameSync(temporaryPath, finalPath);
            if(portrait) { try { Portraits.save(__dirname, id, portrait); } catch(error) { notify('Looks Profile: aparência salva, mas o retrato não foi gravado: {error}', {error: error.message}); } }
			loadProfiles();

			rebuildSettingsUi();
			notify('Looks Profile: “{name}” salvo com aparência, details e shape completos. Origem: {source}. Reabra somente o TERA, mantendo o Toolbox iniciado, e escolha este perfil em Customize → Presets.', {name: escapeHtml(profile.profileName), source: escapeHtml(profile.sourceName)});
			return id;
		} catch (error) {
			notify('Looks Profile: erro ao salvar o perfil: {error}', {error: error.message});
		}
	}

	function showStatus() {
        notify('Looks Profile {version}: {count} perfil(is) salvo(s). Nenhum perfil padrão ou aplicação automática. Escolha um preset em Customize → Presets.', {version: '1.3.4', count: profiles.size});
        try { feedback.push({status:true}); if(feedback.length>6)feedback.shift(); mod.command.message(UiTest.describe(mod)); } catch (error) { notify('Looks Profile: status indisponível: {error}', {error: error.message}); }
    }

	this.destructor = () => {
        disposeGuiShortcut();
		if (settingsUi) {
			settingsUi.destructor();
			settingsUi = null;
		}
		mod.command.remove('lookprofile');
	};
};

module.exports.NetworkMod = module.exports;
module.exports.ClientMod = UiTest.ClientMod;
