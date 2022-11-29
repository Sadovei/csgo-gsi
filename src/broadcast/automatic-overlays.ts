import {
  leftSide,
  playerCamera,
  povSide,
  rightSide,
  topBar
} from '../assemblers/automatic-overlays'

import { GameDataKey } from '../types/parsed'
import GsiParser from '../parsers'
import { Server as SocketServer } from 'socket.io'
import VmixCommands from './vmix/commands'

export default class AutomaticOverlays {
  private gsiParser: GsiParser
  private socketServer: SocketServer
  private vmixCommands: VmixCommands

  constructor(gsiParser: GsiParser, socketServer: SocketServer) {
    this.gsiParser = gsiParser
    this.socketServer = socketServer
    this.vmixCommands = new VmixCommands()

  }

  // Broadcast to active rooms every 300ms
  broadcastOverlays(): void {
    setInterval(() => {
      // Make sure Game Data is ready before broadcasting
      ;['main', 'igdir', 'delay'].forEach((client) => {
        if (this.gsiParser.clientsInfo[client as GameDataKey].gameDataReady) {
          if (this.gsiParser.gameData[client as GameDataKey]) {
            // TopBar Status
            if (
              this.gsiParser.gameData &&
              this.gsiParser.gameData[client as GameDataKey].map &&
              this.gsiParser.gameData[client as GameDataKey].round &&
              this.gsiParser.gameData[client as GameDataKey].phase &&
              (process.env.STREAM?.toUpperCase() === "A" ? this.gsiParser.redisData.matchInfoA : this.gsiParser.redisData.matchInfoB) &&
              this.gsiParser.gameData[client as GameDataKey].sides &&
              this.gsiParser.gameData[client as GameDataKey].defuseTime &&
              this.gsiParser.gameData[client as GameDataKey].lastPlayerMVP &&
              this.gsiParser.gameData[client as GameDataKey].teamOnFire
            ) {
              this.socketServer
                .to(`${client}_OverlayTopBar`)
                .emit(
                  `${client}_OverlayTopBar`,
                  topBar(
                    this.gsiParser.gameData[client as GameDataKey].map,
                    this.gsiParser.gameData[client as GameDataKey].round,
                    this.gsiParser.gameData[client as GameDataKey].phase,
                    (process.env.STREAM?.toUpperCase() === "A" ? this.gsiParser.redisData.matchInfoA : this.gsiParser.redisData.matchInfoB),
                    this.gsiParser.gameData[client as GameDataKey].sides,
                    this.gsiParser.gameData[client as GameDataKey].defuseTime,
                    this.gsiParser.gameData[client as GameDataKey].lastPlayerMVP,
                    this.gsiParser.gameData[client as GameDataKey].teamOnFire
                  )
                )
            }

            if (
              this.gsiParser.gameData[client as GameDataKey].allPlayers &&
              this.gsiParser.gameData[client as GameDataKey].sides &&
              this.gsiParser.gameData[client as GameDataKey].map &&
              this.gsiParser.gameData[client as GameDataKey].player &&
              this.gsiParser.gameData[client as GameDataKey].phase &&
              (process.env.STREAM?.toUpperCase() === "A" ? this.gsiParser.redisData.typeOfEventA : this.gsiParser.redisData.typeOfEventB)
            ) {
              // LeftSide Status
              this.socketServer
                .to(`${client}_OverlayLeftSide`)
                .emit(
                  `${client}_OverlayLeftSide`,
                  leftSide(
                    this.gsiParser.gameData[client as GameDataKey].allPlayers,
                    this.gsiParser.gameData[client as GameDataKey].sides,
                    this.gsiParser.gameData[client as GameDataKey].map,
                    this.gsiParser.gameData[client as GameDataKey].player,
                    this.gsiParser.gameData[client as GameDataKey].phase,
                    (process.env.STREAM?.toUpperCase() === "A" ? this.gsiParser.redisData.typeOfEventA : this.gsiParser.redisData.typeOfEventB)
                  )
                )

              // RightSide Status
              this.socketServer
                .to(`${client}_OverlayRightSide`)
                .emit(
                  `${client}_OverlayRightSide`,
                  rightSide(
                    this.gsiParser.gameData[client as GameDataKey].allPlayers,
                    this.gsiParser.gameData[client as GameDataKey].sides,
                    this.gsiParser.gameData[client as GameDataKey].map,
                    this.gsiParser.gameData[client as GameDataKey].player,
                    this.gsiParser.gameData[client as GameDataKey].phase
                  )
                )
            }

            // POV Status
            if (this.gsiParser.gameData[client as GameDataKey].player) {
              this.socketServer.to(`${client}_OverlayPovSide`)
                .emit(`${client}_OverlayPovSide`, povSide(
                  this.gsiParser.gameData[client as GameDataKey].player,
                  this.gsiParser.cameraToggle
                ))
            }
          }
        }
      })

      if (this.gsiParser.clientsInfo.main.gameDataReady) {
        if (this.gsiParser.gameData.main)
          if (this.gsiParser.redisData.playersData && this.gsiParser.gameData.main.player && this.gsiParser.gameData.main.sides) {
            let infoCamera = playerCamera(
              this.gsiParser.gameData.main.player,
              this.gsiParser.redisData.playersData,
              this.gsiParser.gameData.main.sides,
              Number(process.env.STREAM?.toUpperCase() === 'A' ? this.gsiParser.redisData.swapA : this.gsiParser.redisData.swapB)
            )
            if (infoCamera.seat !== 0 && this.gsiParser.cameraToggle) {
              this.vmixCommands.PlayersCamsIn(infoCamera)
            } else {
              this.vmixCommands.PlayersCamsOut()
            }
          }
      }
    }, 100)

    setInterval(() => {
      // Make sure Game Data is ready before broadcasting
      ;['main', 'igdir', 'delay'].forEach((client) => {
        if (this.gsiParser.clientsInfo[client as GameDataKey].gameDataReady) {
          if (this.gsiParser.gameData[client as GameDataKey]) {
            // Radar Status
            if (this.gsiParser.gameData[client as GameDataKey].radar) {
              this.socketServer.to(`${client}_OverlayRadar`).emit(
                `${client}_OverlayRadar`,
                this.gsiParser.gameData[client as GameDataKey].radar
              )
            }
          }
        }
      })
    }, 15)
  }
}
