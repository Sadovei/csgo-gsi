import { PhaseMap, RoundWinningType } from '../common/csgo'

export interface GsiMap {
  mode: string
  name: string
  phase: PhaseMap
  round: number
  team_ct: GsiMap_Team
  team_t: GsiMap_Team
  num_matches_to_win_series: number
  current_spectators: number
  souvenirs_total: number
  round_wins?: GsiMap_RoundWin
}

export interface GsiMap_RoundWin {
  [key: string]: RoundWinningType
}

export interface GsiMap_Team {
  name?: string
  score: number
  consecutive_round_losses: number
  timeouts_remaining: number
  matches_won_this_series: number
}
