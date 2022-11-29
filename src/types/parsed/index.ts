import { GameAllPlayers } from './all-players'
import { GameBomb } from './bomb'
import { GameMap } from './map'
import { GamePhase } from './phase-countdowns'
import { GamePlayer } from './player'
import { GameRound } from './round'

export default interface GameData {
  main: GameState
  igdir: GameState
  delay: GameState
}

export type GameDataKey = 'main' | 'igdir' | 'delay'
export type GameSideKey = 'leftSide' | 'rightSide'

export interface GameState {
  map: GameMap
  allPlayers: GameAllPlayers
  bomb: GameBomb
  phase: GamePhase
  player: GamePlayer
  round: GameRound
  sides: GameSide

  defuseTime: string

  playersMVP: object
  radar: any
  lastPlayerMVP: object
  teamOnFire: any
}

export interface GameSide {
  leftSide: SideTeam
  rightSide: SideTeam
}

export interface BombState {
  explodeTime: string
  defuseTime: string
}

interface SideTeam {
  teamName: string
  teamKey: string
  side: 'CT' | 'T'
  players: any
  timeouts_remaining: number
  score: number
}
