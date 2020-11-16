/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Tracker extends EventEmitter {
    tokens: string[];
    events: string[];
    apiUrl: string;
    refreshRate: string;
    private playerList;
    private clanList;
    private activeToken;
    private clanData;
    private playerData;
    constructor(options: TrackerOptions);
    addPlayers(playerTag: string | string[]): this;
    addClans(clanTag: string): this;
    removePlayers(playerTag: string | string[]): this;
    removeClans(clanTag: string | string[]): this;
    updateRefreshRate(rate: string): this;
    start(): void;
    get players(): string[];
    get clans(): string[];
    private trackPlayers;
    private trackClans;
    private get token();
}
export interface TrackerOptions {
    tokens: string[];
    events: event[];
    apiUrl?: string;
    refreshRate?: string;
}
export declare type event = playerEvent | clanEvent;
declare type playerEvent = 'PLAYER_UPDATE' | 'PLAYER_TROOP_UPDATE' | 'PLAYER_ACHIEVEMENT_UPDATE';
declare type clanEvent = 'CLAN_UPDATE';
export {};
