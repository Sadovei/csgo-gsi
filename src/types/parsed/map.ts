import { PhaseMap, RoundWinningType } from '../common/csgo'

export interface GameMap {
  round_wins?: GameMap_RoundWin
  name: string
  round: number
  team_ct: GameMap_Team
  team_t: GameMap_Team
  phase: PhaseMap
}

export interface GameMap_RoundWin {
  [key: string]: RoundWinningType
}

export interface GameMap_Team {
  name?: string
  score: number
  consecutive_round_losses: number
  timeouts_remaining: number
}
