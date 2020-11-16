import fetch, { RequestInit } from 'node-fetch';
import { validateTag } from '../utils/utils';
import qs from 'querystring';

export class Client {

	public apiURL: string;
	public token: string;

	public constructor(options: ClientOptions) {
		this.apiURL = options.apiURL || 'https://api.clashofclans.com/v1/';
		this.token = options.token;
	}

	public player(playerTag: string): Promise<Player> {
		const parsed = validateTag(playerTag);
		return this.get(`players/${parsed}`);
	}

	/**
	 * @example
	 * // Search for clans by name
	 * const clans = await client.clans('Tribe Gaming');
	 *
	 * // Search for clans by providing various options
	 * const clans = await client.clans({ name: 'Tribe', limit: 1 });
	 */
	public clans(options: string | ClanSearchOptions): Promise<Record<string, unknown>[]> {
		const opts: ClanSearchOptions = typeof options === 'string' ? { name: 'options' } : options;
		return this.get(`clans${this.query(opts)}`);
	}

	/**
	 * @example
	 * const clan = await client.clan('#')
	 */
	public clan(clanTag: string): Promise<Record<string, unknown>> {
		const parsed = validateTag(clanTag);
		return this.get(`clans/${parsed}`);
	}

	public clanMembers(clanTag: string, filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		const parsed = validateTag(clanTag);
		return this.get(`clans/${parsed}/members${this.query(filters)}`);
	}

	public clanWar(clanTag: string): Promise<Record<string, unknown>> {
		const parsed = validateTag(clanTag);
		return this.get(`clans/${parsed}/currentwar`);
	}

	public clanWarLog(clanTag: string, filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		const parsed = validateTag(clanTag);
		return this.get(`clans/${parsed}/warlog${this.query(filters)}`);
	}

	public clanWarLeague(clanTag: string): Promise<Record<string, unknown>> {
		const parsed = validateTag(clanTag);
		return this.get(`clans/${parsed}/currentwar/leaguegroup`);
	}

	public clanWarLeagueWar(warTag: string): Promise<Record<string, unknown>> {
		const parsed = validateTag(warTag);
		return this.get(`clanwarleagues/wars/${parsed}`);
	}

	public playerLabels(filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`labels/players${this.query(filters)}`);
	}

	public clanLabels(filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`labels/clans${this.query(filters)}`);
	}

	public locations(filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`locations${this.query(filters)}`);
	}

	public location(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>> {
		return this.get(`locations/${locationId}${this.query(filters)}`);
	}

	public clanRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`locations/${locationId}/rankings/clans${this.query(filters)}`);
	}

	public playerRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`locations/${locationId}/rankings/players${this.query(filters)}`);
	}

	public versusClanRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`locations/${locationId}/rankings/clans-versus${this.query(filters)}`);
	}

	public versusPlayerRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`locations/${locationId}/rankings/players-versus${this.query(filters)}`);
	}

	public leagues(filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`leagues${this.query(filters)}`);
	}

	public league(leagueId: number | string): Promise<Record<string, unknown>> {
		return this.get(`leagues/${leagueId}`);
	}

	public leagueSeason(leagueId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>> {
		return this.get(`leagues/${leagueId}/seasons${this.query(filters)}`);
	}

	public leagueRanking(leagueId: number | string, seasonId: number | string): Promise<Record<string, unknown>[]> {
		return this.get(`leagues/${leagueId}/seasons/${seasonId}`);
	}

	public warLeagues(filters?: FilterOptions): Promise<Record<string, unknown>[]> {
		return this.get(`warleagues${this.query(filters)}`);
	}

	public warLeague(leagueId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>> {
		return this.get(`warleagues/${leagueId}${this.query(filters)}`);
	}

	private get(url: string, init?: RequestInit) {
		return fetch(`${this.apiURL}${url}`, init).then(res => res.json());
	}

	private query(opts: any) {
		return `?${qs.stringify(opts)}`;
	}

}

export interface ClientOptions {
	apiURL?: string;
	token: string;
}

export interface FilterOptions {
	limit?: number;
	after?: string;
	before?: string;
}

export interface ClanSearchOptions {
	name?: string;
	warFrequency?: string;
	locationId?: string;
	minMembers?: number;
	maxMembers?: number;
	minClanPoints?: number;
	minClanLevel?: number;
	limit?: number;
	after?: number;
	before?: number;
	labelIds?: string;
}

export interface Player {
	name: string;
	tag: string;
	townHallLevel: number;
	townHallWeaponLevel?: number;
	expLevel: number;
	trophies: number;
	bestTrophies: number;
	warStars: number;
	attackWins: number;
	defenseWins: number;
	builderHallLevel?: number;
	versusTrophies?: number;
	bestVersusTrophies?: number;
	versusBattleWins?: number;
	role?: string;
	donations: number;
	donationsReceived: number;
	clan?: {
		tag: string;
		name: string;
		clanLevel: number;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
	};
	league?: {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			tiny: string;
			medium: string;
		};
	};
	achievements: [{
		name: string;
		stars: number;
		value: number;
		target: number;
		info: string;
		completionInfo: string | null;
		village: 'home' | 'builderBase';
	}];
	labels: [{
		id: number;
		name: string;
		iconUrls: {
			small: string;
			medium: string;
		};
	}];
	troops: [{
		name: string;
		level: number;
		maxLevel: number;
		village: 'home' | 'builderBase';
	}];
	heroes: [{
		name: string;
		level: number;
		maxLevel: number;
		village: 'home' | 'builderBase';
	}];
	spells: [{
		name: string;
		level: number;
		maxLevel: number;
		village: 'home' | 'builderBase';
	}];
	[x: string]: any;
}

export interface Clan {
	tag: string;
	name: string;
	type: string;
	description: string;
	location: {
		localizedName: string;
		id: number;
		name: string;
		isCountry: boolean;
		countryCode: string;
	};
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
	clanLevel: number;
	clanPoints: number;
	clanVersusPoints: number;
	requiredTrophies: number;
	warFrequency: string;
	warWinStreak: number;
	warWins: number;
	warTies?: number;
	warLosses?: number;
	isWarLogPublic: boolean;
	warLeague?: {
		name: string;
		id: number;
	};
	members: number;
	labels: [{
		id: number;
		name: string;
		iconUrls: {
			small: string;
			medium: string;
		};
	}];
	memberList: [{
		name: string;
		tag: string;
		role: string;
		expLevel: number;
		league: {
			id: number;
			name: string;
			iconUrls: {
				small: string;
				tiny: string;
				medium: string;
			};
		};
		trophies: number;
		versusTrophies: number;
		clanRank: number;
		previousClanRank: number;
		dontaions: number;
		donationsReceived: number;
	}];
	[x: string]: any;
}
