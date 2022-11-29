import {
  Gsi_ObservatorSlotType,
  Gsi_PlayerState,
  Gsi_PlayerStats,
  Gsi_Weapons
} from '../common/gsi-Data'

import { TeamType } from '../common/csgo'

export interface GsiPlayer {
  steamid: string
  name: string
  observer_slot: Gsi_ObservatorSlotType
  team: TeamType
  activity: GsiPlayer_PlayerActivityType
  match_stats: Gsi_PlayerStats
  state: Gsi_PlayerState
  weapons: Gsi_Weapons
  position: string
  forward: string
  spectarget?: string
  clan?: string
}

type GsiPlayer_PlayerActivityType = 'playing' | 'free' | 'textinput' | 'menu'
