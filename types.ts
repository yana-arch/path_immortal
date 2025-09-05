// Fix: Created types.ts to define all data structures.

export type ViewType =
  | 'cultivation'
  | 'treasures'
  | 'equipment'
  | 'alchemy'
  | 'inventory'
  | 'supernatural'
  | 'challenges'
  | 'event'
  | 'sect'
  | 'map'
  | 'friends'
  | 'pavilion'
  | 'history'
  | 'settings';

export type Prerequisite =
  | { type: 'realm'; level: number; } // realmLevel index
  | { type: 'technique'; id: string; level: number; };

export interface SpecialEffect {
  id: string;
  sourceId: string;
  sourceType: 'technique' | 'treasure';
  name: string;
  description: string;
  unlockLevel: number;
  cost: number; // Spirit Stones
  cooldown: number; // in seconds
  effect: {
    type: 'instant_qi' | 'temporary_buff';
    value: number;
    duration?: number; // for buffs
    buffEffect?: ElixirEffect; // for buffs
  };
}

export interface Technique {
  id: string;
  name: string;
  description: string;
  level: number;
  baseCost: number;
  costMultiplier: number;
  qiBonusPerLevel: number;
  prerequisites?: Prerequisite[];
  specialEffects?: SpecialEffect[];
}

export interface MagicTreasure {
  id: string;
  name: string;
  description: string;
  owned: boolean;
  level: number;
  baseCost: number;
  upgradeCostBase: number;
  upgradeCostMultiplier: number;
  baseQiBonus: number;
  bonusPerLevel: number;
  specialEffects?: SpecialEffect[];
}

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  level: number;
  baseCost: number;
  costMultiplier: number;
  bonusMultiplier: number; // e.g., 0.05 for 5%
}

export enum ElixirEffectType {
  ADDITIVE = 'ADDITIVE',
  MULTIPLICATION = 'MULTIPLICATION',
}

export interface ElixirEffect {
  type: ElixirEffectType;
  value: number;
}

export interface Elixir {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // in seconds
  effect: ElixirEffect;
}

export type InventoryItemType = 'elixir' | 'material' | 'quest';

export interface InventoryItem {
    id: string; // Unique ID for this stack in the inventory
    itemId: string; // ID of the base item (e.g., elixir's ID)
    name: string;
    description: string;
    type: InventoryItemType;
    quantity: number;
}


export interface Buff {
  elixirId: string;
  name: string;
  timeLeft: number; // in seconds
  effect: ElixirEffect;
}

export interface ChallengeCompletionCondition {
  type: 'qi_per_second' | 'total_qi' | 'realm_level';
  value: number;
}

export interface ChallengeReward {
  qi: number;
  stones: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  completionCondition: ChallengeCompletionCondition;
  reward: ChallengeReward;
}

export interface ChallengeState {
  id: string;
  isClaimed: boolean;
}

export interface GameEventChoice {
  text: string;
  effect: () => void;
}

export interface GameEvent {
  title: string;
  description: string;
  choices: GameEventChoice[];
}

export interface SectTreasuryItem {
  id: string;
  name: string;
  description: string;
  cost: number; // contribution cost
  rankRequired: number; // index in ranks array
  effect?: ElixirEffect;
}

export interface SectRank {
  name: string;
  contributionRequired: number;
  qiBonus: number;
}

export interface Sect {
  id:string;
  name: string;
  description: string;
  ranks: SectRank[];
  treasury: SectTreasuryItem[];
}

export interface SectMission {
    id: string;
    name: string;
    description: string;
    duration: number; // in minutes
    reward: {
        contribution: number;
    };
}

export interface ActiveSectMission {
    missionId: string;
    completionTime: number;
}


export interface MapLocationEffect {
  type: 'qi_per_second_flat' | 'qi_per_second_multiplier';
  value: number;
  description: string;
}

export interface MapLocation {
  id: string;
  name: string;
  description: string;
  travelCost: number;
  travelTime: number; // in seconds
  effect?: MapLocationEffect;
}

export interface Friend {
  id: string;
  name: string;
  realm: string;
  background: string;
  relationshipLevel: number;
}

export interface PendingFriend {
    name: string;
    realm: string;
    background: string;
}

export interface ActiveDialogue {
    friendName: string;
    content: string;
}

export interface DialogueMessage {
    sender: 'user' | 'friend';
    text: string;
}

export interface ActiveDaoLuChat {
    friendId: string;
    friendName: string;
    messages: DialogueMessage[];
}

export interface HistoryEntry {
    timestamp: number;
    message: string;
}

export interface ApiKey {
    id: string;
    alias: string;
    key: string;
}

export interface ApiKeyGroup {
    id: string;
    name: string;
    keyIds: string[];
}

export interface ApiSettings {
    keys: Record<string, ApiKey>;
    groups: Record<string, ApiKeyGroup>;
    activeGroupId: string | null;
}

export interface GameSettings {
    isNsfwEnabled: boolean;
}

export interface PavilionItemEffectBuff {
    effectType: ElixirEffectType;
    value: number;
    duration: number;
}
export interface PavilionItemEffect {
    buffDetails: PavilionItemEffectBuff;
}

// Note: PavilionItem is structurally similar to an Elixir but sourced from the Pavilion
export interface PavilionItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: PavilionItemEffect;
}


export interface PavilionCharacter {
    id: string;
    name: string;
    realm: string;
    background: string;
    interactionCost: number;
}

export interface PavilionState {
    description: string;
    items: PavilionItem[];
    characters: PavilionCharacter[];
}


export interface GameState {
  spiritQi: number;
  spiritStones: number;
  realm: string;
  realmLevel: number;
  age: number;
  lifespan: number;
  qiAndBlood: number;
  gender: 'Nam' | 'Nữ';
  appearance: string;
  lastUpdate: number;
  techniques: Technique[];
  treasures: MagicTreasure[];
  equipment: EquipmentItem[];
  equipped: Partial<Record<EquipmentSlot, string>>;
  elixirs: Elixir[];
  inventory: InventoryItem[];
  activeBuffs: Buff[];
  effectCooldowns: Record<string, number>; // effectId -> completion timestamp
  challenges: Challenge[];
  challengeStates: ChallengeState[];
  playerSect: string | null;
  sectContribution: number;
  sects: Sect[];
  sectMissions: SectMission[];
  activeSectMission: ActiveSectMission | null;
  sectTreasuryStock: Record<string, boolean>; // key: itemId, value: isBought
  sectSceneryDescription: string | null;
  currentLocationId: string;
  travelDestinationId: string | null;
  travelCompletionTime: number | null;
  mapLocations: MapLocation[];
  friends: Friend[];
  daoLuIds: string[];
  songTuCooldowns: Record<string, number>; // friendId: timestamp
  pendingFriend: PendingFriend | null;
  activeDialogue: ActiveDialogue | null;
  activeDaoLuChat: ActiveDaoLuChat | null;
  spiritVeinCharge: number;
  isEventGenerationEnabled: boolean;
  history: HistoryEntry[];
  apiSettings: ApiSettings;
  gameSettings: GameSettings;
  pavilionState: PavilionState | null;
}

export interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  qiPerSecond: number;
  tick: (deltaTime: number) => void;
  upgradeTechnique: (techniqueId: string) => void;
  buyTreasure: (treasureId: string) => void;
  upgradeTreasure: (treasureId: string) => void;
  upgradeEquipment: (itemId: string) => void;
  equipItem: (item: EquipmentItem) => void;
  craftElixir: (elixirId: string) => void;
  useItem: (inventoryId: string) => void;
  discardItem: (inventoryId: string, quantity?: number) => void;
  activateSpecialEffect: (effectId: string) => void;
  claimChallengeReward: (challengeId: string) => void;
  generateCustomEvent: (prompt: string) => Promise<void>;
  generateAiContent: (type: string, prompt: string) => Promise<void>;
  generateSectScenery: () => Promise<void>;
  joinSect: (sectId: string) => void;
  contributeToSect: (amount: number) => void;
  startSectMission: (missionId: string) => void;
  buySectItem: (itemId: string) => void;
  startTravel: (destinationId: string) => void;
  sendGiftToFriend: (friendId: string, amount: number) => void;
  startDialogueWithFriend: (friendId: string) => Promise<void>;
  formPartnership: (friendId: string) => void;
  startSongTu: (friendId: string) => void;
  startDaoLuChat: (friendId: string) => Promise<void>;
  sendDaoLuMessage: (friendId: string, message: string) => Promise<void>;
  closeDaoLuChat: () => void;
  closeDialogue: () => void;
  confirmNewFriend: (friendData: PendingFriend) => void;
  cancelNewFriend: () => void;
  collectSpiritVein: () => void;
  saveGame: () => void;
  resetGame: () => void;
  toggleEventGeneration: () => void;
  toggleNsfwMode: () => void;
  logs: string[];
  addApiKey: (alias: string, key: string) => void;
  deleteApiKey: (id: string) => void;
  createApiKeyGroup: (name: string) => void;
  updateApiKeyGroup: (id: string, name: string, keyIds: string[]) => void;
  deleteApiKeyGroup: (id: string) => void;
  setActiveApiKeyGroup: (id: string | null) => void;
  refreshPavilion: () => Promise<void>;
  buyPavilionItem: (itemId: string) => void;
  interactWithPavilionCharacter: (characterId: string) => void;
  currentEvent: GameEvent | null;
}