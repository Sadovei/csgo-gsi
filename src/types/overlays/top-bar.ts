import { BombType, PhaseExt, PhaseMap, TeamType } from '../common/csgo'

export interface TopBarOverlay {
  round: RoundInfo
  leftSide: SideTeam
  rightSide: SideTeam
  mapInfo: MapInfo
}

interface RoundInfo {
  phase: PhaseExt
  time: string
  bomb?: BombType
  win_team?: TeamType
  bombState: any
}

interface SideTeam {
  score: number
  name: string
  nameKey: string
  sideTeam: TeamType
  timeouts_remaining: number
  players: any
}

interface MapInfo {
  currentRound: number
  bestOf: number
  vetoLegend: ParsedInfo
  phase: PhaseMap
  mvps: MVPS
  teamOnFire: any
  historyRounds: any
  mapName: string
}

export interface ParsedInfo {
  [key: string]: ParsedMap
}

export interface MVPS {
  [key: string]: number
}

export interface ParsedMap {
  [key: string]: number | null | string
}
