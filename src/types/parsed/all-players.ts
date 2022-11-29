import {
  Gsi_ObservatorSlotType,
  Gsi_PlayerState,
  Gsi_PlayerStats,
  Gsi_Weapons
} from '../common/gsi-Data'

import { TeamType } from '../common/csgo'

export interface GameAllPlayers {
  [steamid: string]: GameAllPlayers_PlayerList
}

export interface GameAllPlayers_PlayerList {
  playerName: string
  teamSide: TeamType

  observer_slot: Gsi_ObservatorSlotType
  match_stats: Gsi_PlayerStats
  position: string
  forward: string
  state: Gsi_PlayerState
  weapons: Gsi_Weapons

  shoot: number | undefined
  currentRoundDmg: number
  totalDmg: number
  adr: number

  teamName: string
  teamKey: string
  playerKey: string
  seat: string
}
