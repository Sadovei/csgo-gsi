import { GameAllPlayers } from '../types/parsed/all-players'
import { GsiAllPlayers } from '../types/gsi/all-players'

export default function allPlayersParser(data: GsiAllPlayers, allPlayers: GameAllPlayers) {
  Object.keys(allPlayers).forEach((steamID: string) => {
    if (!data[steamID]) {
      delete allPlayers[steamID]
    }
  });

  Object.keys(data).forEach((steamID: string) => {
    if (!allPlayers[steamID]) {
      allPlayers[steamID] = {
        playerName: data[steamID].name,
        observer_slot: data[steamID].observer_slot,
        teamSide: data[steamID].team,
        match_stats: data[steamID].match_stats,
        position: data[steamID].position,
        forward: data[steamID].forward,
        state: data[steamID].state,
        weapons: data[steamID].weapons,

        shoot: 0,
        currentRoundDmg: 0,
        totalDmg: 0,
        adr: 0,

        teamName: '',
        teamKey: '',
        playerKey: '',
        seat: '',
      }
    }
  })
}
