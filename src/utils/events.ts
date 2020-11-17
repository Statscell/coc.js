import { Tracker } from '../lib/Tracker';
import { Player, Clan } from '../lib/Client';

export function handlePlayerChanges(client: Tracker, oldData: Player, newData: Player) {
	// General player data update realted event
	if (client.events.includes('PLAYER_UPDATE')) {
		const keys = [];
		const previous: dynamicObj = {};
		const current: dynamicObj = {};

		if (oldData.name !== newData.name) {
			keys.push('name');
			previous.name = oldData.name;
			current.name = newData.name;
		}
		if ((oldData.clan && !newData.clan) || (!oldData.clan && newData.clan) || (oldData.clan?.tag !== newData.clan?.tag)) {
			keys.push('clan');
			previous.clan = oldData.clan || null;
			current.clan = newData.clan || null;
		}
		if (oldData.townHallLevel !== newData.townHallLevel) {
			keys.push('townhallLevel');
			previous.townHallLevel = oldData.townHallLevel;
			current.townHallLevel = newData.townHallLevel;
		}
		if ((oldData.townHallWeaponLevel || newData.townHallWeaponLevel) && (oldData.townHallWeaponLevel !== newData.townHallWeaponLevel)) {
			keys.push('townHallWeaponLevel');
			previous.townHallWeaponLevel = oldData.townHallWeaponLevel || null;
			current.townHallWeaponLevel = oldData.townHallWeaponLevel;
		}
		if (oldData.expLevel !== newData.expLevel) {
			keys.push('expLevel');
			previous.expLevel = oldData.expLevel;
			current.expLevel = newData.expLevel;
		}
		if (oldData.trophies !== newData.trophies) {
			keys.push('trophies');
			previous.trophies = oldData.trophies;
			current.trophies = newData.trophies;
		}
		if (oldData.bestTrophies !== newData.bestTrophies) {
			keys.push('bestTrophies');
			previous.bestTrophies = oldData.bestTrophies;
			current.bestTrophies = newData.bestTrophies;
		}
		if (oldData.warStars !== newData.warStars) {
			keys.push('warStars');
			previous.warStars = oldData.warStars;
			current.warStars = newData.warStars;
		}
		if (oldData.attackWins !== newData.attackWins) {
			keys.push('attackWins');
			previous.attackWins = oldData.attackWins;
			current.attackWins = newData.attackWins;
		}
		if (oldData.defenseWins !== newData.defenseWins) {
			keys.push('defenseWins');
			previous.defenseWins = oldData.defenseWins;
			current.defenseWins = newData.defenseWins;
		}
		if ((oldData.builderHallLevel || newData.builderHallLevel) && (oldData.builderHallLevel !== newData.builderHallLevel)) {
			keys.push('builderHallLevel');
			previous.builderHallLevel = oldData.builderHallLevel || null;
			current.builderHallLevel = newData.builderHallLevel;
		}
		if ((oldData.versusTrophies || newData.versusTrophies) && (oldData.versusTrophies !== newData.versusTrophies)) {
			keys.push('versusTrophies');
			previous.versusTrophies = oldData.versusTrophies || null;
			current.versusTrophies = newData.versusTrophies;
		}
		if ((oldData.bestVersusTrophies || newData.bestVersusTrophies) && (oldData.bestVersusTrophies !== newData.bestVersusTrophies)) {
			keys.push('bestVersusTrophies');
			previous.bestVersusTrophies = oldData.bestVersusTrophies || null;
			current.bestVersusTrophies = newData.bestVersusTrophies;
		}
		if ((oldData.versusBattleWins || newData.versusBattleWins) && (oldData.versusBattleWins !== newData.versusBattleWins)) {
			keys.push('versusBattleWins');
			previous.versusBattleWins = oldData.versusBattleWins || null;
			current.versusBattleWins = newData.versusBattleWins;
		}
		if ((oldData.role || newData.role) && (oldData.role !== newData.role)) {
			keys.push('role');
			previous.role = oldData.role || null;
			current.role = newData.role;
		}
		if (oldData.donations !== newData.donations) {
			keys.push('donations');
			previous.donations = oldData.donations;
			current.donations = newData.donations;
		}
		if (oldData.donationsReceived !== newData.donationsReceived) {
			keys.push('donationsReceived');
			previous.donationsReceived = oldData.donationsReceived;
			current.donationsReceived = newData.donationsReceived;
		}
		if (oldData.league !== newData.league) {
			keys.push('league');
			previous.league = oldData.league;
			current.league = newData.league;
		}

		const oldLabels = oldData.labels ? oldData.labels.map(lb => lb.id).sort() : null;
		const newLabels = newData.labels ? newData.labels.map(lb => lb.id).sort() : null;
		if (newLabels !== oldLabels) {
			keys.push('labels');
			previous.labels = oldData.labels;
			current.labels = newData.labels;
		}

		// Add essentital information to the response if there is any information updated...
		if (keys.length) {
			previous.tag = oldData.tag;
			current.tag = newData.tag;

			if (!keys.includes('name')) {
				previous.name = oldData.name;
				current.name = newData.name;
			}

			client.emit('playerUpdate', { keys, previous, current });
		}
	}

	// Achievement updates related event
	if (client.events.includes('PLAYER_ACHIEVEMENT_UPDATE')) {
		const achievements = [];
		for (const ach of newData.achievements) {
			const oldAch = oldData.achievements?.find(ac => ac.name === ach.name);
			const oldValue = oldAch ? oldAch.value : null;
			if (oldValue !== ach.value) achievements.push({ name: ach.name, previous: oldAch, current: ach });
		}
		if (achievements.length) client.emit('playerAchievementUpdate', achievements);
	}

	// Player Troop update realted event
	if (client.events.includes('PLAYER_TROOP_UPDATE')) {
		const heroes = [];
		for (const hero of newData.heroes) {
			const oldHero = oldData.heroes.find(he => he.name === hero.name);
			const oldLvl = oldHero ? oldHero.level : null;
			if (oldLvl !== hero.level) heroes.push({ name: hero.name, oldLevel: oldLvl, newLevel: hero.level, maxLevel: hero.maxLevel, village: hero.village });
		}

		const spells = [];
		for (const spell of newData.spells) {
			const oldSpell = oldData.spells.find(sp => sp.name === spell.name);
			const oldLvl = oldSpell ? oldSpell.level : null;
			if (oldLvl !== spell.level) spells.push({ name: spell.name, oldLevel: oldLvl, newLevel: spell.level, maxLevel: spell.maxLevel, village: spell.village });
		}

		const troops = [];
		for (const troop of newData.troops) {
			const oldTroop = oldData.troops.find(sp => sp.name === troop.name);
			const oldLvl = oldTroop ? oldTroop.level : null;
			if (oldLvl !== troop.level) troops.push({ name: troop.name, oldLevel: oldLvl, newLevel: troop.level, maxLevel: troop.maxLevel, village: troop.village });
		}

		const output: dynamicObj = {};
		const keys = [];

		if (heroes.length) {
			keys.push('heroes');
			output.heroes = heroes;
		}
		if (spells.length) {
			keys.push('spells');
			output.spells = spells;
		}
		if (troops.length) {
			keys.push('troops');
			output.troops = troops;
		}
		if (keys.length) client.emit('playerTroopUpdate', output);
	}

}

export function handleClanChanges(client: Tracker, oldData: Clan, newData: Clan) {
	if (client.events.includes('CLAN_UPDATE')) {
		const keys = [];
		const previous: dynamicObj = {};
		const current: dynamicObj = {};

		if (oldData.name !== newData.name) {
			keys.push('name');
			previous.name = oldData.name;
			current.name = newData.name;
		}

		if (oldData.description !== newData.description) {
			keys.push('description');
			previous.description = oldData.description;
			current.description = newData.description;
		}

		if (oldData.type !== newData.type) {
			keys.push('type');
			previous.type = oldData.type;
			current.type = newData.type;
		}

		if (oldData.location.name !== newData.location.name) {
			keys.push('location');
			previous.location = oldData.location;
			current.location = newData.location;
		}

		if (oldData.badgeUrls.large !== newData.badgeUrls.large) {
			keys.push('badgeUrls');
			previous.badgeUrls = oldData.badgeUrls;
			current.badgeUrls = newData.badgeUrls;
		}

		if (oldData.clanLevel !== newData.clanLevel) {
			keys.push('clanLevel');
			previous.clanLevel = oldData.clanLevel;
			current.clanLevel = newData.clanLevel;
		}

		if (oldData.clanPoints !== newData.clanPoints) {
			keys.push('clanPoints');
			previous.clanPoints = oldData.clanPoints;
			current.clanPoints = newData.clanPoints;
		}

		if (oldData.clanVersusPoints !== newData.clanVersusPoints) {
			keys.push('clanVersusPoints');
			previous.clanVersusPoints = oldData.clanVersusPoints;
			current.clanVersusPoints = newData.clanVersusPoints;
		}

		if (oldData.requiredTrophies !== newData.requiredTrophies) {
			keys.push('requiredTrophies');
			previous.requiredTrophies = oldData.requiredTrophies;
			current.requiredTrophies = newData.requiredTrophies;
		}

		if (oldData.warFrequency !== newData.warFrequency) {
			keys.push('warFrequency');
			previous.warFrequency = oldData.warFrequency;
			current.warFrequency = newData.warFrequency;
		}

		if (oldData.warWinStreak !== newData.warWinStreak) {
			keys.push('warWinStreak');
			previous.warWinStreak = oldData.warWinStreak;
			current.warWinStreak = newData.warWinStreak;
		}

		if (oldData.warWins !== newData.warWins) {
			keys.push('warWins');
			previous.warWins = oldData.warWins;
			current.warWins = newData.warWins;
		}

		if (oldData.warTies !== newData.warTies) {
			keys.push('warTies');
			previous.warTies = oldData.warTies || null;
			current.warTies = newData.warTies || null;
		}

		if (oldData.warLosses !== newData.warLosses) {
			keys.push('warLosses');
			previous.warLosses = oldData.warLosses || null;
			current.warLosses = newData.warLosses || null;
		}

		if (oldData.isWarLogPublic !== newData.isWarLogPublic) {
			keys.push('isWarLogPublic');
			previous.isWarLogPublic = oldData.isWarLogPublic;
			current.isWarLogPublic = newData.isWarLogPublic;
		}

		if ((oldData.warLeague || newData.warLeague) && (oldData.warLeague?.id !== newData.warLeague?.id)) {
			keys.push('warLeague');
			previous.warLeague = oldData.warLeague;
			current.warLeague = newData.warLeague;
		}

		if (oldData.members !== newData.members) {
			keys.push('members');
			previous.members = oldData.members;
			current.members = newData.members;
		}

		const oldLabels = oldData.labels ? oldData.labels.map(lb => lb.id).sort() : null;
		const newLabels = newData.labels ? newData.labels.map(lb => lb.id).sort() : null;
		if (newLabels !== oldLabels) {
			keys.push('labels');
			previous.labels = oldData.labels;
			current.labels = newData.labels;
		}

		if (keys.length) {
			previous.tag = oldData.tag;
			current.tag = newData.tag;

			if (!keys.includes('name')) {
				previous.name = oldData.name;
				current.name = newData.name;
			}

			client.emit('clanUpdate', { keys, previous, current });
		}
	}
}

interface dynamicObj {
	[key: string]: any;
}
