import { Tracker } from '../lib/Tracker';
import { Player, Clan } from '../lib/Client';
export declare function handlePlayerChanges(client: Tracker, oldData: Player, newData: Player): void;
export declare function handleClanChanges(client: Tracker, oldData: Clan, newData: Clan): void;
