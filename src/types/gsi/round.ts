import { BombType, TeamType } from '../common/csgo'

export interface GsiRound {
  phase: GsiPhaseRound
  bomb?: BombType
  win_team?: TeamType
}

type GsiPhaseRound = 'live' | 'freezetime' | 'over'
