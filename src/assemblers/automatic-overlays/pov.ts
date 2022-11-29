import { GamePlayer } from '../../types/parsed/player'
import { POVOverlay } from '../../types/overlays/pov'

export default function povSide(
  player: GamePlayer,
  toggleCamera: boolean
): POVOverlay {
  let objOverlay = {
    playerName: player.playerName,
    playerKey: player.playerKey,
    teamKey: player.teamkey,
    teamName: player.teamName,
    state: player.state,
    weapons: player.weapons,
    toggleCamera: toggleCamera,
    teamSide: player.teamSide
  }

  return objOverlay
}