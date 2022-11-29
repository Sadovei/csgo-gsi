import GameData, { GameState } from '../types/parsed'
import { ClientsInfo, GsiClient, GsiClientObservers } from '../types/common/server'

import GsiData from '../types/gsi'
import allPlayersParser from './allPlayersParser'
import mapParser from './map'
import bombParser from './bomb'
import phaseParser from './phase'
import playerParser from './player'
import roundParser from './round'
import sideDecider from './sideDecider'
import playersMVP from './playersMVP'
import radar from './radar'
import teamOnFire from './teamOnFire'
import { averageDamageRound } from './averageDamageRound'
import RedisData from '../types/redis'
import allPlayersParserUpdate from './allPlayersParserUpdate'

export default class GsiParser {
  public clientsInfo: ClientsInfo = {
    main: {
      gameDataReady: false,
      resetValue: true
    },
    delay: {
      gameDataReady: false,
      resetValue: true
    },
    igdir: {
      gameDataReady: false,
      resetValue: true
    }
  }
  // Redis Data
  public redisData: RedisData = {
    typeOfEventA: '',
    typeOfEventB: ''
  }

  // Parsed Data
  public gameData: GameData = {
    main: <GameState>{},
    igdir: <GameState>{},
    delay: <GameState>{}
  }
  public cameraToggle = false
  // We only parse data that has been updated


  // We only parse data that has been updated
  parse(client: GsiClient, dataGSI: GsiData): void {
    // Set to which observer gameData you should save the parsed data
    let gameDataReceiver = <GameState>{} // this.gameData
    switch (client.type) {
      case GsiClientObservers.MAIN:
        gameDataReceiver = this.gameData.main
        break
      case GsiClientObservers.IGDIR:
        gameDataReceiver = this.gameData.igdir
        break
      case GsiClientObservers.DELAY:
        gameDataReceiver = this.gameData.delay
        break
    }

    //RESET Values Once before The Game start!
    if (this.clientsInfo[client.type].resetValue) {
      gameDataReceiver.allPlayers = {}
      gameDataReceiver.sides = {
        leftSide: {
          teamName: 'CT',
          teamKey: 'placeholder',
          side: 'CT',
          players: [],
          timeouts_remaining: 0,
          score: 0
        },
        rightSide: {
          teamName: 'T',
          teamKey: 'placeholder',
          side: 'T',
          players: [],
          timeouts_remaining: 0,
          score: 0
        }
      }
      gameDataReceiver.defuseTime = '0'
      gameDataReceiver.teamOnFire = 'none'
      gameDataReceiver.lastPlayerMVP = {}
      this.clientsInfo[client.type].resetValue = false
    }

    if (dataGSI.map) {
      // Until The Game is not started!
      if (dataGSI.map.phase === 'warmup') {
        if (dataGSI.allplayers) {
          allPlayersParser(dataGSI.allplayers, gameDataReceiver.allPlayers)
        }
      }

      // If game Started without 10 players/ Backend RESET!, still check Players 
      if (Object.keys(gameDataReceiver.allPlayers).length < 10 && dataGSI.allplayers) {
        allPlayersParser(dataGSI.allplayers, gameDataReceiver.allPlayers)
      }

      //==================================    All ABOVE UPDATE ALWAYS =============================================

      //Create Side CT Left and T Right and Update sides every round
      //Update all Players Parsed with data from GSI
      if (Object.keys(gameDataReceiver.allPlayers).length > 0) {
        //Update Info for All Players Parsed
        if (this.redisData.playersData) {
          if (dataGSI.allplayers)
            allPlayersParserUpdate(dataGSI.allplayers, gameDataReceiver.allPlayers, this.redisData.playersData)
          gameDataReceiver.sides = sideDecider(this.redisData.playersData, dataGSI.map, gameDataReceiver.allPlayers)
        }

        //Find the MVP
        if (dataGSI.allplayers)
          gameDataReceiver.lastPlayerMVP = playersMVP(gameDataReceiver.allPlayers, dataGSI.allplayers)

        // Calculate ADR
        if (dataGSI.round?.phase)
          averageDamageRound(dataGSI.map.round, dataGSI.round.phase, gameDataReceiver.allPlayers)
      }

      // Parse Radar Data
      if (dataGSI.allplayers && dataGSI.player && dataGSI.grenades && dataGSI.bomb && dataGSI.phase_countdowns) {
        gameDataReceiver.radar = radar(gameDataReceiver.allPlayers, dataGSI.player, dataGSI.grenades, dataGSI.map, dataGSI.phase_countdowns, dataGSI.bomb)
      }

      // Parse Bomb Data
      if (dataGSI.bomb) {
        gameDataReceiver.bomb = bombParser(dataGSI.bomb)
      }

      // Parse Defuse Time
      if (dataGSI.bomb && dataGSI.bomb.state) {
        if (dataGSI.bomb.state === 'defusing')
          gameDataReceiver.defuseTime = dataGSI.bomb?.countdown ?? '0'
        else
          gameDataReceiver.defuseTime = '0'
      }

      // check teamOnFire
      if (dataGSI.map?.round_wins && Object.keys(dataGSI.map.round_wins).length > 0 && dataGSI.map.round)
        gameDataReceiver.teamOnFire = teamOnFire(dataGSI.map.round_wins, dataGSI.map.round)

      // Parse Map Data
      gameDataReceiver.map = mapParser(dataGSI.map)

      // Parse Phase Data
      if (dataGSI.phase_countdowns) {
        gameDataReceiver.phase = phaseParser(dataGSI.phase_countdowns)
      }

      // Parse Player Data
      if (dataGSI.player) {
        gameDataReceiver.player = playerParser(dataGSI.player, gameDataReceiver.allPlayers)
      }

      // Parse Round Data
      if (dataGSI.round) {
        gameDataReceiver.round = roundParser(dataGSI.round)
      } else {
        gameDataReceiver.round = {
          bomb: '',
          win_team: ''
        }
      }

      this.clientsInfo[client.type].gameDataReady = true

    } else {
      this.clientsInfo[client.type].resetValue = true

      gameDataReceiver.map = mapParser({
        mode: '',
        name: '',
        phase: 'gameover',
        round: -1,
        team_ct: {
          name: '',
          score: 0,
          consecutive_round_losses: 0,
          timeouts_remaining: 0,
          matches_won_this_series: 0
        },
        team_t: {
          name: '',
          score: 0,
          consecutive_round_losses: 0,
          timeouts_remaining: 0,
          matches_won_this_series: 0
        },
        num_matches_to_win_series: 0,
        current_spectators: 0,
        souvenirs_total: 0,
      })

      gameDataReceiver.player = playerParser({
        steamid: '',
        name: '',
        observer_slot: 0,
        team: '',
        activity: 'playing',
        match_stats: {
          kills: 0,
          assists: 0,
          deaths: 0,
          mvps: 0,
          score: 0
        },
        state: {
          health: 0,
          armor: 0,
          helmet: false,
          flashed: 0,
          smoked: 0,
          burning: 0,
          money: 0,
          round_kills: 0,
          round_killhs: 0,
          round_totaldmg: 0,
          equip_value: 0
        },
        weapons: {},
        position: '',
        forward: ''
      }, {})

      gameDataReceiver.phase = phaseParser({
        phase: 'over',
        phase_ends_in: '-100'
      })

      gameDataReceiver.teamOnFire = 'none'
    }
  }
}
