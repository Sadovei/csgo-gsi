import GsiParser from '../parsers'
import RedisParser from './index'

export default async function swapTeam(gsiParser: GsiParser, redisParser: RedisParser, keyRedis: string) {
    if (process.env.STREAM?.toUpperCase() === 'A')
        gsiParser.redisData.typeOfEventA = await redisParser.getKeyContent(keyRedis)
    else
        gsiParser.redisData.typeOfEventB = await redisParser.getKeyContent(keyRedis)
}
