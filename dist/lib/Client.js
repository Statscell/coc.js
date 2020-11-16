"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("../utils/utils");
const querystring_1 = __importDefault(require("querystring"));
class Client {
    constructor(options) {
        this.apiURL = options.apiURL || 'https://api.clashofclans.com/v1/';
        this.token = options.token;
    }
    player(playerTag) {
        const parsed = utils_1.validateTag(playerTag);
        return this.get(`players/${parsed}`);
    }
    clans(options) {
        const opts = typeof options === 'string' ? { name: 'options' } : options;
        return this.get(`clans${this.query(opts)}`);
    }
    clan(clanTag) {
        const parsed = utils_1.validateTag(clanTag);
        return this.get(`clans/${parsed}`);
    }
    clanMembers(clanTag, filters) {
        const parsed = utils_1.validateTag(clanTag);
        return this.get(`clans/${parsed}/members${this.query(filters)}`);
    }
    clanWar(clanTag) {
        const parsed = utils_1.validateTag(clanTag);
        return this.get(`clans/${parsed}/currentwar`);
    }
    clanWarLog(clanTag, filters) {
        const parsed = utils_1.validateTag(clanTag);
        return this.get(`clans/${parsed}/warlog${this.query(filters)}`);
    }
    clanWarLeague(clanTag) {
        const parsed = utils_1.validateTag(clanTag);
        return this.get(`clans/${parsed}/currentwar/leaguegroup`);
    }
    clanWarLeagueWar(warTag) {
        const parsed = utils_1.validateTag(warTag);
        return this.get(`clanwarleagues/wars/${parsed}`);
    }
    playerLabels(filters) {
        return this.get(`labels/players${this.query(filters)}`);
    }
    clanLabels(filters) {
        return this.get(`labels/clans${this.query(filters)}`);
    }
    locations(filters) {
        return this.get(`locations${this.query(filters)}`);
    }
    location(locationId, filters) {
        return this.get(`locations/${locationId}${this.query(filters)}`);
    }
    clanRanks(locationId, filters) {
        return this.get(`locations/${locationId}/rankings/clans${this.query(filters)}`);
    }
    playerRanks(locationId, filters) {
        return this.get(`locations/${locationId}/rankings/players${this.query(filters)}`);
    }
    versusClanRanks(locationId, filters) {
        return this.get(`locations/${locationId}/rankings/clans-versus${this.query(filters)}`);
    }
    versusPlayerRanks(locationId, filters) {
        return this.get(`locations/${locationId}/rankings/players-versus${this.query(filters)}`);
    }
    leagues(filters) {
        return this.get(`leagues${this.query(filters)}`);
    }
    league(leagueId) {
        return this.get(`leagues/${leagueId}`);
    }
    leagueSeason(leagueId, filters) {
        return this.get(`leagues/${leagueId}/seasons${this.query(filters)}`);
    }
    leagueRanking(leagueId, seasonId) {
        return this.get(`leagues/${leagueId}/seasons/${seasonId}`);
    }
    warLeagues(filters) {
        return this.get(`warleagues${this.query(filters)}`);
    }
    warLeague(leagueId, filters) {
        return this.get(`warleagues/${leagueId}${this.query(filters)}`);
    }
    get(url, init) {
        return node_fetch_1.default(`${this.apiURL}${url}`, init).then(res => res.json());
    }
    query(opts) {
        return `?${querystring_1.default.stringify(opts)}`;
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map