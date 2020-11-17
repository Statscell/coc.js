"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
const events_1 = require("../utils/events");
const utils_1 = require("../utils/utils");
const events_2 = require("events");
const cron_1 = require("cron");
const node_fetch_1 = __importDefault(require("node-fetch"));
class Tracker extends events_2.EventEmitter {
    constructor(options) {
        super();
        this.playerList = [];
        this.clanList = [];
        this.activeToken = 0;
        this.inMaintenance = false;
        this.clanData = new Map();
        this.playerData = new Map();
        this.tokens = options.tokens;
        this.events = options.events;
        this.apiUrl = options.apiUrl || 'https://api.clashofclans.com/v1/';
        this.refreshRate = options.refreshRate || '* 1 * * * *';
        if (this.tokens.length < 1)
            throw new Error('You must provided at least 1 token. Better provide multiple tokens to avoid rate limiting!');
        if (this.events.length < 1)
            throw new Error('No need to initialize a tracker if you are not willing to track any events!');
    }
    addPlayers(playerTag) {
        const list = Array.isArray(playerTag) ? playerTag : [playerTag];
        for (const item of list) {
            const tag = utils_1.validateTag(item, false);
            if (tag)
                this.playerList.push(tag);
        }
        return this;
    }
    addClans(clanTag) {
        const list = Array.isArray(clanTag) ? clanTag : [clanTag];
        for (const item of list) {
            const tag = utils_1.validateTag(item, false);
            if (tag)
                this.clanList.push(tag);
        }
        return this;
    }
    removePlayers(playerTag) {
        const list = Array.isArray(playerTag) ? playerTag : [playerTag];
        for (const item of list) {
            const tag = utils_1.validateTag(item);
            if (tag) {
                const index = this.playerList.indexOf(tag);
                if (index > -1)
                    this.playerList = this.playerList.splice(index, 1);
            }
        }
        return this;
    }
    removeClans(clanTag) {
        const list = Array.isArray(clanTag) ? clanTag : [clanTag];
        for (const item of list) {
            const tag = utils_1.validateTag(item);
            if (tag) {
                const index = this.clanList.indexOf(tag);
                if (index > -1)
                    this.clanList = this.clanList.splice(index, 1);
            }
        }
        return this;
    }
    updateRefreshRate(rate) {
        this.refreshRate = rate;
        return this;
    }
    start() {
        const clanJob = new cron_1.CronJob(this.refreshRate, () => {
            void this.trackClans();
        });
        const playerJob = new cron_1.CronJob(this.refreshRate, () => {
            void this.trackPlayers();
        });
        clanJob.start();
        playerJob.start();
    }
    get players() {
        return this.playerList;
    }
    get clans() {
        return this.clanList;
    }
    handleMaintenance(res) {
        if (!this.inMaintenance && res.status === 503 && this.events.includes('MAINTENANCE_START')) {
            this.emit('maintenanceStart');
            this.inMaintenance = true;
        }
        if (this.inMaintenance && res.status !== 503 && this.events.includes('MAINTENANCE_END')) {
            this.emit('maintenanceEnd');
            this.inMaintenance = false;
        }
        return res;
    }
    async trackPlayers() {
        for (const player of this.playerList) {
            const newData = await node_fetch_1.default(`${this.apiUrl}players/%23${player}`, { headers: { Authorization: `Bearer ${this.token}` } })
                .then(res => this.handleMaintenance(res))
                .then(res => res.json());
            const oldData = this.playerData.get(player);
            if (oldData)
                events_1.handlePlayerChanges(this, oldData, newData);
            this.playerData.set(player, newData);
        }
    }
    async trackClans() {
        for (const clan of this.clanList) {
            const newData = await node_fetch_1.default(`${this.apiUrl}clans/%23${clan}`, { headers: { Authorization: `Bearer ${this.token}` } })
                .then(res => this.handleMaintenance(res))
                .then(res => res.json());
            const oldData = this.clanData.get(clan);
            if (oldData)
                events_1.handleClanChanges(this, oldData, newData);
            this.clanData.set(clan, newData);
        }
    }
    get token() {
        const token = this.activeToken >= this.tokens.length ? this.tokens[0] : this.tokens[this.activeToken];
        this.activeToken += 1;
        return token;
    }
}
exports.Tracker = Tracker;
//# sourceMappingURL=Tracker.js.map