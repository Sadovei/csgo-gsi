import { GameAllPlayers } from '../types/parsed/all-players'
import { GameMap } from '../types/parsed/map'
import { GameSide } from '../types/parsed'
import Redis_ParsedPlayers from '../types/redis/parsed/players'

export default function sideDecider(redisPlayers: Redis_ParsedPlayers, gameMap: GameMap, gamePlayers: GameAllPlayers): GameSide {
  let gameSide: GameSide = {
    leftSide: {
      teamName: 'CT',
      teamKey: 'placeholder',
      side: 'CT',
      players: {},
      timeouts_remaining: gameMap.team_ct.timeouts_remaining,
      score: gameMap.team_ct.score
    },
    rightSide: {
      teamName: 'T',
      teamKey: 'placeholder',
      side: 'T',
      players: {},
      timeouts_remaining: gameMap.team_t.timeouts_remaining,
      score: gameMap.team_t.score
    }
  }

  // ADD Players + Score + TimeOut + Side on LEFT and RIGHT side on round < 15
  Object.keys(gamePlayers).forEach((steamGame: string) => {
    if (gameMap.round < 15 || (gameMap.round === 15 && gameMap.phase === 'intermission')) {
      if (gamePlayers[steamGame].teamSide === 'CT') {
        if (gamePlayers[steamGame].state.health > 0)
          gameSide.leftSide.players[steamGame] = true
        else
          gameSide.leftSide.players[steamGame] = false
      } else {
        if (gamePlayers[steamGame].state.health > 0)
          gameSide.rightSide.players[steamGame] = true
        else
          gameSide.rightSide.players[steamGame] = false
      }
    } else if ((gameMap.round > 15 && gameMap.round < 30) || (gameMap.round === 15 && gameMap.phase === 'live') || (gameMap.round === 30 && gameMap.phase === 'intermission')) {
      if (gamePlayers[steamGame].teamSide === 'T')
        if (gamePlayers[steamGame].state.health > 0)
          gameSide.leftSide.players[steamGame] = true
        else
          gameSide.leftSide.players[steamGame] = false
      else
        if (gamePlayers[steamGame].state.health > 0)
          gameSide.rightSide.players[steamGame] = true
        else
          gameSide.rightSide.players[steamGame] = false
    } else if (gameMap.round > 30 || (gameMap.round === 30 && gameMap.phase === 'live')) {
      if (checkNumber(gameMap.round, gameMap.phase)) {
        if (gamePlayers[steamGame].teamSide === 'T')
          if (gamePlayers[steamGame].state.health > 0)
            gameSide.leftSide.players[steamGame] = true
          else
            gameSide.leftSide.players[steamGame] = false
        else
          if (gamePlayers[steamGame].state.health > 0)
            gameSide.rightSide.players[steamGame] = true
          else
            gameSide.rightSide.players[steamGame] = false
      } else if (checkNumber(gameMap.round, gameMap.phase) === false) {
        if (gamePlayers[steamGame].teamSide === 'CT')
          if (gamePlayers[steamGame].state.health > 0)
            gameSide.leftSide.players[steamGame] = true
          else
            gameSide.leftSide.players[steamGame] = false
        else
          if (gamePlayers[steamGame].state.health > 0)
            gameSide.rightSide.players[steamGame] = true
          else
            gameSide.rightSide.players[steamGame] = false
      }
    }
  })

  // CHANGE TeamKey and TeamName for LeftSide
  Object.keys(gameSide.leftSide.players).forEach(steamID => {
    if (redisPlayers[steamID]) {
      if (redisPlayers[steamID].teamKey)
        gameSide.leftSide.teamKey = redisPlayers[steamID].teamKey

      if (redisPlayers[steamID].teamName)
        gameSide.leftSide.teamName = redisPlayers[steamID].teamName
    }

    if (gamePlayers[steamID].teamSide === 'CT') {
      gameSide.leftSide.timeouts_remaining = gameMap.team_ct.timeouts_remaining
      gameSide.leftSide.score = gameMap.team_ct.score
      gameSide.leftSide.side = 'CT'
    } else {
      gameSide.leftSide.timeouts_remaining = gameMap.team_t.timeouts_remaining
      gameSide.leftSide.score = gameMap.team_t.score
      gameSide.leftSide.side = 'T'
    }
  })

  // CHANGE TeamKey and TeamName for RightSide
  Object.keys(gameSide.rightSide.players).forEach(steamID => {
    if (redisPlayers[steamID]) {
      if (redisPlayers[steamID].teamKey)
        gameSide.rightSide.teamKey = redisPlayers[steamID].teamKey

      if (redisPlayers[steamID].teamName)
        gameSide.rightSide.teamName = redisPlayers[steamID].teamName
    }

    if (gamePlayers[steamID].teamSide === 'CT') {
      gameSide.rightSide.timeouts_remaining = gameMap.team_ct.timeouts_remaining
      gameSide.rightSide.score = gameMap.team_ct.score
      gameSide.rightSide.side = 'CT'
    } else {
      gameSide.rightSide.timeouts_remaining = gameMap.team_t.timeouts_remaining
      gameSide.rightSide.score = gameMap.team_t.score
      gameSide.rightSide.side = 'T'
    }
  })
  return gameSide;
}

function checkNumber(number: number, phase: string) {
  let cat, rest, response
  rest = number % 6
  cat = Math.floor(number / 6)
  if ((cat % 2 === 0 && rest % 6 >= 0 && rest % 6 <= 2) || (cat % 2 === 1 && rest % 6 >= 3 && rest % 6 <= 5)) {
    response = true
  } else {
    response = false
  }

  if ((response && phase === 'intermission' && rest !== 0) || (!response && phase === 'live') || (!response && phase === 'intermission' && rest === 0)) {
    return true
  } else if ((response && phase === 'live') || (response && phase === 'intermission' && rest === 0) || (!response && phase === 'intermission' && rest !== 0)) {
    return false
  }
  return response
}
