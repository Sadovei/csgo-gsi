import { GameAllPlayers } from '../types/parsed/all-players'
import { GamePlayer } from '../types/parsed/player'
import { GsiPlayer } from '../types/gsi/player'

export default function playerParser(playerPOV: GsiPlayer, allPlayers: GameAllPlayers): GamePlayer {
  let player: any = {}

  Object.keys(allPlayers).forEach(steamID => {
    if (steamID === playerPOV.steamid) {
      player = {
        steamid: playerPOV.steamid,
        observer_slot: playerPOV.observer_slot,
        playerName: allPlayers[steamID].playerName,
        teamName: allPlayers[steamID].teamName,
        teamkey: allPlayers[steamID].teamKey,
        playerKey: allPlayers[steamID].playerKey,
        weapons: allPlayers[steamID].weapons,
        state: allPlayers[steamID].state,
        teamSide: allPlayers[steamID].teamSide
      }
    }
  })

  return player
}
