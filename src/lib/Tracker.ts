import { handlePlayerChanges, handleClanChanges } from '../utils/events';
import { validateTag } from '../utils/utils';
import { Player, Clan } from './Client';
import { EventEmitter } from 'events';
import { CronJob } from 'cron';
import fetch from 'node-fetch';

export class Tracker extends EventEmitter {

	public tokens: string[];
	public events: string[];
	public apiUrl: string;
	public refreshRate: string;

	private playerList: string[] = [];
	private clanList: string[] = [];
	private activeToken = 0;

	private clanData = new Map();
	private playerData = new Map();

	public constructor(options: TrackerOptions) {
		super();

		this.tokens = options.tokens;
		this.events = options.events;
		this.apiUrl = options.apiUrl || 'https://api.clashofclans.com/v1/';
		this.refreshRate = options.refreshRate || '* 1 * * * *';

		if (this.tokens.length < 1) throw new Error('You must provided at least 1 token. Better provide multiple tokens to avoid rate limiting!');
		if (this.events.length < 1) throw new Error('No need to initialize a tracker if you are not willing to track any events!');
	}

	public addPlayers(playerTag: string | string[]) {
		const list = Array.isArray(playerTag) ? playerTag : [playerTag];
		for (const item of list) {
			const tag = validateTag(item, false);
			if (tag) this.playerList.push(tag);
		}
		return this;
	}

	public addClans(clanTag: string) {
		const list = Array.isArray(clanTag) ? clanTag : [clanTag];
		for (const item of list) {
			const tag = validateTag(item, false);
			if (tag) this.clanList.push(tag);
		}
		return this;
	}

	public removePlayers(playerTag: string | string[]) {
		const list = Array.isArray(playerTag) ? playerTag : [playerTag];
		for (const item of list) {
			const tag = validateTag(item);
			if (tag) {
				const index = this.playerList.indexOf(tag);
				if (index > -1) this.playerList = this.playerList.splice(index, 1);
			}
		}
		return this;
	}

	public removeClans(clanTag: string | string[]) {
		const list = Array.isArray(clanTag) ? clanTag : [clanTag];
		for (const item of list) {
			const tag = validateTag(item);
			if (tag) {
				const index = this.clanList.indexOf(tag);
				if (index > -1) this.clanList = this.clanList.splice(index, 1);
			}
		}
		return this;
	}

	public updateRefreshRate(rate: string) {
		this.refreshRate = rate;
		return this;
	}

	public start() {
		const clanJob = new CronJob(this.refreshRate, () => {
			void this.trackClans();
		});
		const playerJob = new CronJob(this.refreshRate, () => {
			void this.trackPlayers();
		});
		clanJob.start();
		playerJob.start();
	}

	public get players() {
		return this.playerList;
	}

	public get clans() {
		return this.clanList;
	}

	private async trackPlayers() {
		for (const player of this.playerList) {
			const newData: Player = await fetch(`${this.apiUrl}players/%23${player}`, { headers: { Authorization: `Bearer ${this.token}` } })
				.then(res => res.json());
			const oldData: Player = this.playerData.get(player);
			if (oldData) handlePlayerChanges(this, oldData, newData);
			this.playerData.set(player, newData);
		}
	}

	private async trackClans() {
		for (const clan of this.clanList) {
			const newData: Clan = await fetch(`${this.apiUrl}clans/%23${clan}`, { headers: { Authorization: `Bearer ${this.token}` } })
				.then(res => res.json());
			const oldData: Clan = this.clanData.get(clan);
			if (oldData) handleClanChanges(this, oldData, newData);
			this.clanData.set(clan, newData);
		}
	}

	private get token() {
		const token = this.activeToken >= this.tokens.length ? this.tokens[0] : this.tokens[this.activeToken];
		this.activeToken += 1;
		return token;
	}

}

export interface TrackerOptions {
	tokens: string[];
	events: event[];
	apiUrl?: string;
	refreshRate?: string;
}

export type event = playerEvent | clanEvent;

type playerEvent = 'PLAYER_UPDATE' | 'PLAYER_TROOP_UPDATE' | 'PLAYER_ACHIEVEMENT_UPDATE';
type clanEvent = 'CLAN_UPDATE';
/*
type warEvent = 'WAR_STATE_UPDATE' | 'WAR_ATTACK';
type clientEvent = 'MAINTENANCE_START' | 'MAINTENANCE_END';
*/
