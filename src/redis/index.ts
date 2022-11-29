import { Logger, logColors } from '../utils/logger'
import playersData, { parseTeam } from './playersData'
import redis, { RedisClient, RedisError, RetryStrategyOptions } from 'redis'

import { EventEmitter } from 'events'
import GsiParser from '../parsers'
import { Redis_TeamData } from '../types/redis/data/players'
import matchData from './matchInfo'
import swapTeam from './swapTeam'
import typeOfEvent from './typeOfEvent'

export default class RedisParser {
  private host = '10.99.4.20'
  private port = 6379
  private password = 'YfjcjkULNVVQdqaLYMK6gFxv7M6VmGt9zxctNCbfHku42xZju64CdfAkSgYQWT4v'
  private db = 0
  private logger: Logger

  public ready = false
  public clientRead: RedisClient
  public clientSubscription: RedisClient

  public gsiParser: GsiParser
  private redisEvent: EventEmitter


  constructor(gsiParser: GsiParser) {
    this.gsiParser = gsiParser
    this.logger = new Logger('Redis Database', logColors.Green)
    this.redisEvent = new EventEmitter()

    // this.clientRead - is used to read, get, set keys in Redis
    this.clientRead = redis.createClient({
      host: this.host,
      port: this.port,
      db: this.db,
      retry_strategy: this.retryStrategy
    })

    // this.clientSubscription - is used to listen for changes in  this.clientRead
    this.clientSubscription = redis.createClient({
      host: this.host,
      port: this.port,
      db: this.db,
      retry_strategy: this.retryStrategy
    })

    if (this.password !== '') {
      this.clientRead.auth(this.password)
      this.clientSubscription.auth(this.password)
    }
  }

  retryStrategy = (options: RetryStrategyOptions) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      this.logger.danger('The server refused the connection')
      return undefined
    }
    return Math.min(options.attempt * 100, 3000)
  }

  connect() {
    this.clientRead.on('error', (err: RedisError) => {
      this.logger.danger(err.name)
    })

    this.clientRead.on('ready', () => {
      this.ready = true
      this.refreshData()
      this.listener(this.redisEvent)
    })
  }

  getKeyContent(key: string): any {
    return new Promise((resolve, reject) => {
      this.clientRead.get(key, (error: any, content: any) => {
        resolve(JSON.parse(content))
      })
    })
  }

  setKey(key: string, toSaveObj: any) {
    this.clientRead.set(key, JSON.stringify(toSaveObj))
    console.log(`${key} is saved to Redis!`)
  }

  getFolderKeys(folderName: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.clientRead.keys('*', function (error, keys) {
        if (error) {
          console.log(error)
          throw error
        }
        resolve(
          keys.filter((key) => {
            return key.startsWith(folderName)
          })
        )
      })
    })
  }

  refreshData() {
    if (this.ready) {
      // Get All Players From Redis and add them to gsiParser.redisData.playersData
      playersData(this.gsiParser, this)
      matchData(this.gsiParser, this, `matchInfo_${process.env.STREAM}`)
      swapTeam(this.gsiParser, this, `swap_${process.env.STREAM}`)
      typeOfEvent(this.gsiParser, this, `typeOfEvent_${process.env.STREAM}`)

      this.logger.warning('Local Data Updated!')
    } else {
      this.logger.warning('Not yet connected...')
    }

    // When a player changed a key in Redis UPDATE gsiParser.redisData.playersData
    this.redisEvent.on('playersData', async (redisKey) => {
      let teamData: Redis_TeamData = await this.getKeyContent(redisKey)
      let teamKey: string = redisKey.replace(/team:/g, '')
      let parsedTeamPlayers = parseTeam(teamData, teamKey)

      this.gsiParser.redisData.playersData = {
        ...this.gsiParser.redisData.playersData,
        ...parsedTeamPlayers
      }
    })

    this.redisEvent.on('matchInfo', async (redisKey) => {
      matchData(this.gsiParser, this, redisKey)
    })

    this.redisEvent.on('swap', async (redisKey) => {
      swapTeam(this.gsiParser, this, redisKey)
    })

    this.redisEvent.on('typeOfEvent', async (redisKey) => {
      typeOfEvent(this.gsiParser, this, redisKey)
    })
  }

  listener(redisEvent: EventEmitter) {
    this.clientSubscription.config('set', 'notify-keyspace-events', 'KEA')
    this.clientSubscription.subscribe(`__keyevent@${this.db}__:set`)

    this.clientSubscription.on('message', (channel, key) => {
      if (key.substring(0, 5) === 'team:') {
        redisEvent.emit('playersData', key)
      }

      if (key === `matchInfo_${process.env.STREAM}`) {
        redisEvent.emit('matchInfo', key)
      }

      if (key === `swap_${process.env.STREAM}`) {
        redisEvent.emit('swap', key)
      }

      if (key === `typeOfEvent_${process.env.STREAM}`) {
        redisEvent.emit('typeOfEvent', key)
      }
    })
  }
}
