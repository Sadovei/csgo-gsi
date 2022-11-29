import { Redis_ParsedMatchVeto } from './parsed/match-veto'
import Redis_ParsedPlayers from './parsed/players'

export default interface RedisData {
  playersData?: Redis_ParsedPlayers

  swapA?: number
  swapB?: number

  typeOfEventA: string
  typeOfEventB: string

  matchInfoA?: Redis_ParsedMatchVeto
  matchInfoB?: Redis_ParsedMatchVeto
}

export interface TeamPlayers {
  teamKey: string
  teamName: string
  players: PlayersRedis
}

export interface PlayersRedis {
  [steamId: string]: PlayersRedisDetails
}

interface PlayersRedisDetails {
  key: string
  nick: string
  name: string
}