import { BombType, TeamType } from '../common/csgo'

export interface GameRound {
  bomb?: BombType
  win_team?: TeamType
}
