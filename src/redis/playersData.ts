import GsiParser from '../parsers'
import RedisParser from './index'
import Redis_ParsedPlayers from '../types/redis/parsed/players'
import { Redis_TeamData } from '../types/redis/data/players'

export default async function playersData(gsiParser: GsiParser, redisParser: RedisParser) {
  let redisTeamKeys = await redisParser.getFolderKeys('team:')

  let parsedTeamsPomise = redisTeamKeys.map(async (team: string): Promise<Redis_ParsedPlayers> => {
    let teamKey = team.replace(/team:/g, '')
    let teamData: Redis_TeamData = await redisParser.getKeyContent(team)
    return { ...parseTeam(teamData, teamKey) }
  }
  )

  Promise.all(parsedTeamsPomise).then((parsedTeams) => {
    gsiParser.redisData.playersData = parsePlayers(parsedTeams)
  })
}

// Parse Redis team and into a teamObject by steamid
export function parseTeam(teamData: Redis_TeamData, teamKey: string): Redis_ParsedPlayers {
  let parsedTeam: Redis_ParsedPlayers = {}
  Object.keys(teamData.players).forEach((playerKey) => {
    let steamid = teamData.players[playerKey].steam_id
    parsedTeam[steamid] = {
      playerKey: playerKey,
      teamKey: teamKey,
      teamName: teamData.short_name,
      nick: teamData.players[playerKey].nick,
      seat: teamData.players[playerKey].seat,
      steam_id: steamid
    }
  })

  return parsedTeam
}

// Parser each teamObject by steamid and return the final obj
export function parsePlayers(parsedTeams: Redis_ParsedPlayers[]): Redis_ParsedPlayers {
  let parsedPlayers: Redis_ParsedPlayers = {}

  parsedTeams.forEach((team) => {
    Object.keys(team).forEach((steamid) => {
      parsedPlayers[steamid] = team[steamid]
    })
  })

  return parsedPlayers
}
