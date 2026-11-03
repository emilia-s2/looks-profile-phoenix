'use strict';

const APPEARANCE_FIELDS = Object.freeze([
	'unk',
	'skinColor',
	'faceStyle',
	'faceDecal',
	'hairStyle',
	'hairColor',
	'voice',
	'tattoos'
]);

const PROFILE_VERSION = 1;
const EXPECTED_DETAILS_LENGTH = 32;
const MAX_SHAPE_LENGTH = 4096;

function asInteger(value, label, minimum, maximum) {
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum)
		throw new Error(`${label} inválido.`);
	return parsed;
}

function decodeTemplateId(templateId) {
	const id = asInteger(templateId, 'templateId', 10000, 99999);
	const raceGender = Math.floor((id % 10000) / 100);
	const classCode = id % 100;
	if (raceGender < 1 || raceGender > 12 || classCode < 1 || classCode > 13)
		throw new Error('templateId fora da faixa conhecida.');

	return {
		race: Math.floor((raceGender - 1) / 2),
		gender: (raceGender - 1) % 2,
		class: classCode - 1
	};
}

function identityFromLobbyCharacter(character) {
	const race = asInteger(character.race, 'raça', 0, 5);
	const classId = asInteger(character.class, 'classe', 0, 12);
	const rawGender = asInteger(character.gender, 'gênero', 0, 2);
	// S_GET_USER_LIST encodes female=1 and male=2; accept the C_CREATE_USER
	// form (female=1, male=0) as well for compatible Toolbox builds.
	const gender = rawGender === 2 ? 0 : rawGender;
	return { race, gender, class: classId };
}

function toByteArray(value, label, maxLength) {
	let bytes;
	if (Buffer.isBuffer(value) || ArrayBuffer.isView(value))
		bytes = Array.from(value);
	else if (Array.isArray(value))
		bytes = value.slice();
	else
		throw new Error(`${label} não está disponível como bytes.`);

	if (bytes.length === 0 || bytes.length > maxLength)
		throw new Error(`${label} tem tamanho inesperado (${bytes.length}).`);
	for (const byte of bytes) {
		if (!Number.isInteger(byte) || byte < 0 || byte > 255)
			throw new Error(`${label} contém um byte inválido.`);
	}
	return bytes;
}

function normalizeAppearance(value) {
	if (typeof value === 'bigint') {
		const bytes = [];
		for (let i = 0; i < 8; i++)
			bytes.push(Number(value >> BigInt(i * 8) & 0xffn));
		value = Object.fromEntries(APPEARANCE_FIELDS.map((key, index) => [key, bytes[index]]));
	}
	if (!value || typeof value !== 'object')
		throw new Error('Aparência básica não disponível.');

	const appearance = {};
	for (const key of APPEARANCE_FIELDS)
		appearance[key] = asInteger(value[key], `aparência.${key}`, 0, 255);
	return appearance;
}

function getIdentity(source, override) {
	if (override)
		return identityFromLobbyCharacter({ ...source, ...override });
	return decodeTemplateId(source.templateId);
}

function createProfile(profileName, source, identityOverride = null, capturedAt = new Date().toISOString()) {
	if (!source || typeof source !== 'object')
		throw new Error('Dados do personagem não encontrados.');
	const name = String(profileName || '').trim();
	if (!name || name.length > 48)
		throw new Error('O nome do perfil deve ter de 1 a 48 caracteres.');

	const identity = getIdentity(source, identityOverride);
	const appearance2 = Number(source.appearance2);
	if (!Number.isFinite(appearance2))
		throw new Error('O campo appearance2 não está disponível.');

	const details = toByteArray(source.details, 'details', 256);
	if (details.length !== EXPECTED_DETAILS_LENGTH)
		throw new Error(`Perfil não salvo: details tem ${details.length} bytes; eram esperados ${EXPECTED_DETAILS_LENGTH}.`);

	const shape = toByteArray(source.shape, 'shape', MAX_SHAPE_LENGTH);
	return {
		format: 'looks-profile',
		formatVersion: PROFILE_VERSION,
		appearanceOrigin: 'phoenix',
		profileName: name,
		sourceName: String(source.name || 'Personagem').slice(0, 48),
		capturedAt,
		race: identity.race,
		gender: identity.gender,
		class: identity.class,
		appearance: normalizeAppearance(source.appearance),
		appearance2: appearance2 >>> 0,
		details,
		shape
	};
}

function validateProfile(profile) {
	try {
		if (!profile || typeof profile !== 'object' || profile.format !== 'looks-profile' || profile.formatVersion !== PROFILE_VERSION)
			throw new Error('Formato de perfil desconhecido.');
		if (!String(profile.profileName || '').trim())
			throw new Error('Nome do perfil ausente.');
		asInteger(profile.race, 'raça', 0, 5);
		asInteger(profile.gender, 'gênero', 0, 1);
		asInteger(profile.class, 'classe', 0, 12);
		asInteger(profile.appearance2, 'appearance2', 0, 0xffffffff);
		normalizeAppearance(profile.appearance);
		const details = toByteArray(profile.details, 'details', 256);
		if (details.length !== EXPECTED_DETAILS_LENGTH)
			throw new Error(`details deve conter ${EXPECTED_DETAILS_LENGTH} bytes.`);
		toByteArray(profile.shape, 'shape', MAX_SHAPE_LENGTH);
		return null;
	} catch (error) {
		return error.message;
	}
}

module.exports = {
	APPEARANCE_FIELDS,
	PROFILE_VERSION,
	createProfile,
	decodeTemplateId,
	identityFromLobbyCharacter,
	validateProfile
};
