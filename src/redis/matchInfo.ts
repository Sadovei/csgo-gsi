import GsiParser from '../parsers'
import RedisParser from './index'
import { Redis_MatchVeto } from '../types/redis/data/match-veto'

export default async function matchInfo(gsiParser: GsiParser, redisParser: RedisParser, keyRedis: string) {
  let redisTeamKeys: Redis_MatchVeto = await redisParser.getKeyContent(keyRedis)
  let teamKeys: string[] = []

  Object.keys(redisTeamKeys.maps).forEach((map: string) => {
    if (teamKeys.length < 2) {
      Object.keys(redisTeamKeys.maps[map]).forEach((key: string) => {
        if (key !== 'pick' && key !== 'pickName') {
          teamKeys.push(key)
        }
      })
    }
  })

  if (process.env.STREAM?.toUpperCase() === 'A')
    gsiParser.redisData.matchInfoA = {
      maps: redisTeamKeys.maps,
      teams: teamKeys
    }
  else
    gsiParser.redisData.matchInfoB = {
      maps: redisTeamKeys.maps,
      teams: teamKeys
    }
}
