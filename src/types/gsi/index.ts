import { GsiAllPlayers } from './all-players'
import GsiAuth from './auth'
import { GsiBomb } from './bomb'
import { GsiGrenades } from './grenades'
import { GsiMap } from './map'
import { GsiPhase } from './phase-countdowns'
import { GsiPlayer } from './player'
import { GsiRound } from './round'

export interface GsiPreviously {
  map?: GsiMap
}

export default interface GsiData {
  map: GsiMap
  player: GsiPlayer
  auth: GsiAuth
  allplayers: GsiAllPlayers
  round: GsiRound
  grenades: GsiGrenades
  bomb: GsiBomb
  phase_countdowns: GsiPhase
  previously?: any
}
