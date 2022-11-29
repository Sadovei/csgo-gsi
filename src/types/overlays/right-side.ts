import {
  Gsi_ObservatorSlotType,
  Gsi_PlayerState,
  Gsi_PlayerStats,
  Gsi_Weapons
} from '../common/gsi-Data'
import { PhaseExt, TeamType } from '../common/csgo'

export interface RightSideOverlay {
  side: TeamType
  utility: UtilityTeam
  economy: EconomyTeam
  players: Players
  roundPhase: PhaseRound
}

type UtilityTeam = {
  [key in grenade]: number
}

interface Players {
  [key: string]: Player
}

interface EconomyTeam {
  roundLose: number
  bonus: number
  eq_value: number
  remaining_money: number
}

interface PhaseRound {
  phase: PhaseExt
  phase_ends_in: string
}

type grenade =
  | 'weapon_smokegrenade'
  | 'weapon_hegrenade'
  | 'weapon_incgrenade'
  | 'weapon_molotov'
  | 'weapon_flashbang'

interface Player {
  name: string
  nameKey: string
  teamKey: string
  observer_slot: Gsi_ObservatorSlotType
  state: Gsi_PlayerState
  match_stats: Gsi_PlayerStats
  weapons: Gsi_Weapons
  active: boolean
  adr: number
}
