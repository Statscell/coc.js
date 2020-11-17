export declare class Client {
    apiURL: string;
    token: string;
    constructor(options: ClientOptions);
    player(playerTag: string): Promise<Player>;
    clans(options: string | ClanSearchOptions): Promise<Record<string, unknown>[]>;
    clan(clanTag: string): Promise<Record<string, unknown>>;
    clanMembers(clanTag: string, filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    clanWar(clanTag: string): Promise<Record<string, unknown>>;
    clanWarLog(clanTag: string, filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    clanWarLeague(clanTag: string): Promise<Record<string, unknown>>;
    clanWarLeagueWar(warTag: string): Promise<Record<string, unknown>>;
    playerLabels(filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    clanLabels(filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    locations(filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    location(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>>;
    clanRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    playerRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    versusClanRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    versusPlayerRanks(locationId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    leagues(filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    league(leagueId: number | string): Promise<Record<string, unknown>>;
    leagueSeason(leagueId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>>;
    leagueRanking(leagueId: number | string, seasonId: number | string): Promise<Record<string, unknown>[]>;
    warLeagues(filters?: FilterOptions): Promise<Record<string, unknown>[]>;
    warLeague(leagueId: number | string, filters?: FilterOptions): Promise<Record<string, unknown>>;
    private get;
    private query;
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
    achievements: [
        {
            name: string;
            stars: number;
            value: number;
            target: number;
            info: string;
            completionInfo: string | null;
            village: 'home' | 'builderBase';
        }
    ];
    labels?: [
        {
            id: number;
            name: string;
            iconUrls: {
                small: string;
                medium: string;
            };
        }
    ];
    troops: [
        {
            name: string;
            level: number;
            maxLevel: number;
            village: 'home' | 'builderBase';
        }
    ];
    heroes: [
        {
            name: string;
            level: number;
            maxLevel: number;
            village: 'home' | 'builderBase';
        }
    ];
    spells: [
        {
            name: string;
            level: number;
            maxLevel: number;
            village: 'home' | 'builderBase';
        }
    ];
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
    labels?: [
        {
            id: number;
            name: string;
            iconUrls: {
                small: string;
                medium: string;
            };
        }
    ];
    memberList: [
        {
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
        }
    ];
    [x: string]: any;
}
