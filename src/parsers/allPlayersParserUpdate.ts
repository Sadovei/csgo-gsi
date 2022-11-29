import { GameAllPlayers } from '../types/parsed/all-players'
import { GsiAllPlayers } from '../types/gsi/all-players'
import Redis_ParsedPlayers from '../types/redis/parsed/players'

export default function allPlayersParserUpdate(data: GsiAllPlayers, allPlayers: GameAllPlayers, redisPlayers: Redis_ParsedPlayers) {
  Object.keys(data).forEach((steamID: string) => {
    if (allPlayers[steamID]) {
      allPlayers[steamID].observer_slot = data[steamID].observer_slot
      allPlayers[steamID].teamSide = data[steamID].team

      allPlayers[steamID].match_stats.kills = data[steamID].match_stats.kills
      allPlayers[steamID].match_stats.assists = data[steamID].match_stats.assists
      allPlayers[steamID].match_stats.deaths = data[steamID].match_stats.deaths
      allPlayers[steamID].match_stats.score = data[steamID].match_stats.score

      allPlayers[steamID].position = data[steamID].position
      allPlayers[steamID].forward = data[steamID].forward
      allPlayers[steamID].state = data[steamID].state
      allPlayers[steamID].weapons = data[steamID].weapons

      if (redisPlayers[steamID]) {
        allPlayers[steamID].teamName = redisPlayers[steamID].teamName ?? data[steamID].team
        allPlayers[steamID].teamKey = redisPlayers[steamID].teamKey ?? 'placeholder'
        allPlayers[steamID].playerKey = redisPlayers[steamID].playerKey ? redisPlayers[steamID].playerKey : 'placeholder'
        allPlayers[steamID].playerName = redisPlayers[steamID].nick ?? data[steamID].name
        allPlayers[steamID].seat = redisPlayers[steamID].seat ?? '1'
      } else {
        allPlayers[steamID].teamName = data[steamID].team
        allPlayers[steamID].teamKey = 'placeholder'
        allPlayers[steamID].playerKey = 'placeholder'
        allPlayers[steamID].playerName = data[steamID].name
        allPlayers[steamID].seat = '1'
      }
    }
  })
}