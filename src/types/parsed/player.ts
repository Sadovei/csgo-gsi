import {
  Gsi_ObservatorSlotType,
  Gsi_PlayerState,
  Gsi_Weapons
} from '../common/gsi-Data'

import { TeamType } from '../common/csgo'

export interface GamePlayer {
  steamid: string
  observer_slot: Gsi_ObservatorSlotType
  playerName: string
  teamName: TeamType
  teamkey: string
  playerKey: string
  weapons: Gsi_Weapons
  state: Gsi_PlayerState
  teamSide: TeamType
}
