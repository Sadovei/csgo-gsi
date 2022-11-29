import { GameAllPlayers } from "../types/parsed/all-players";
import { GsiAllPlayers } from "../types/gsi/all-players";

export default function playersMVP(allPlayers: GameAllPlayers, gsiPlayers: GsiAllPlayers) {
  let MVP = {}

  Object.keys(allPlayers).forEach((steamID) => {
    if (gsiPlayers[steamID])
      if (allPlayers[steamID].match_stats.mvps < gsiPlayers[steamID].match_stats.mvps) {
        allPlayers[steamID].match_stats.mvps = gsiPlayers[steamID].match_stats.mvps

        MVP = {
          teamSide: allPlayers[steamID].teamSide,
          playerName: allPlayers[steamID].playerName,
          playerKey: allPlayers[steamID].playerKey,
          teamKey: allPlayers[steamID].teamKey
        }
      }
  })
  return MVP
}
