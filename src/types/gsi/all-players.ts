import {
  Gsi_ObservatorSlotType,
  Gsi_PlayerState,
  Gsi_PlayerStats,
  Gsi_Weapons
} from '../common/gsi-Data'

import { TeamType } from '../common/csgo'

export interface GsiAllPlayers {
  [steamid: string]: GsiPlayerList
}

export interface GsiPlayerList {
  clan?: string
  name: string
  observer_slot: Gsi_ObservatorSlotType
  team: TeamType
  state: Gsi_PlayerState
  match_stats: Gsi_PlayerStats
  weapons: Gsi_Weapons
  position: string
  forward: string
}
