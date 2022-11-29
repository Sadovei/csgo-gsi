import {
  GsiClient,
  GsiClientAuth,
  GsiClientObserver,
  GsiClientObservers,
  GsiClientStatus
} from './types/common/server'
import { Logger, logColors } from './utils/logger'
import SocketIO, { Server as SocketServer } from 'socket.io'
import express, { NextFunction, Request, Response } from 'express'

import { AutomaticOverlays } from './broadcast'
import GsiParser from './parsers'
import RedisParser from './redis/index'
import VmixHandler from './broadcast/vmix'
import http from 'http'

export default class CsgoGsi {
  private app: express.Application
  private server: http.Server
  private socketServer: SocketServer

  private vmixHandler: VmixHandler

  private gsiLogger: Logger
  private socketLogger: Logger

  private gsiParser: GsiParser
  private localAddress: string

  // Broadcasters
  private automaticOverlays: AutomaticOverlays

  // Redis Data
  private redisParser: RedisParser

  private gsiClients: GsiClient[] = [
    {
      type: GsiClientObservers.MAIN,
      status: GsiClientStatus.NONE,
      auth: GsiClientAuth.MAIN
    },
    {
      type: GsiClientObservers.IGDIR,
      status: GsiClientStatus.NONE,
      auth: GsiClientAuth.IGDIR
    },
    {
      type: GsiClientObservers.DELAY,
      status: GsiClientStatus.NONE,
      auth: GsiClientAuth.DELAY
    }
  ]
  public rawData: {}

  constructor() {
    this.gsiLogger = new Logger('GSI Server', logColors.Magenta)
    this.socketLogger = new Logger('Socket Server', logColors.Cyan)
    this.rawData = {}

    this.localAddress = "0.0.0.0"

    // Express Server
    this.app = express()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.server = http.createServer(this.app)

    // Socket Server
    this.socketServer = new SocketServer(this.server, {
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      cors: {
        origin: (req, callback) => {
          callback(null, true)
        },
        credentials: true,
        methods: ['GET', 'POST']
      }
    })

    // GSI Data Parser
    this.gsiParser = new GsiParser()

    // Redis Data Handler
    this.redisParser = new RedisParser(this.gsiParser)
    this.vmixHandler = new VmixHandler(this.gsiParser)
    // Automatic Overlays
    this.automaticOverlays = new AutomaticOverlays(
      this.gsiParser,
      this.socketServer
    )
  }

  // Start GSI Server
  public serve = () => {
    const SERVER_PORT = process.env.STREAM === 'a' ? 4400 : 4600

    this.app.get('/gsidata', this.rawGsiData)

    // Open end-point for receiving Csgo GSI Data
    this.app.post(
      '/',
      this.checkGsiAuth,
      this.checkGsiStatus,
      this.parseGsiData
    )

    this.server.listen(SERVER_PORT, '0.0.0.0', () => {
      this.gsiLogger.box(
        `Awaiting client on http://${this.localAddress}:${SERVER_PORT}`,
        logColors.Red
      )

      // Handle socket connections
      this.handleSocketConnections()
      this.socketLogger.box(
        `Awaiting client on http://${this.localAddress}:${SERVER_PORT}`,
        logColors.Red
      )
    })

    // Start Overlay Broadcast
    this.automaticOverlays.broadcastOverlays()

    this.app.post('/vmix', this.vmixHandler.handle)

    // Connect to Redis
    this.redisParser.connect()
  }

  // Authenticate GSI Client
  private checkGsiAuth = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authToken = req.body && req.body.auth.token ? req.body.auth.token : ''

    const client = this.gsiClients.find((client) => client.auth === authToken)

    if (client) {
      req.body.client = client

      if (client.status !== GsiClientStatus.NONE) {
        next()
      } else {
        this.gsiLogger.alert(`${client.type} Game Client Connected!`)
        client.status = GsiClientStatus.CONNECTED
        next()
      }
    } else {
      this.gsiLogger.danger('Invalid Game Client.')
      return res.end()
    }
  }

  // Check GSI Status
  private checkGsiStatus = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // Make sure we are connected to a game
    // if (req.body.map === undefined) {
    //   return res.end()
    // }

    switch (req.body.client.status) {
      case GsiClientStatus.CONNECTED:
        next()
        break
      case GsiClientStatus.DISCONNECTED:
        // TODO: Resume or switch to backup when disconnected
        break
      default:
        return res.end()
    }
  }

  private rawGsiData = (req: Request, res: Response) => {
    res.send(JSON.stringify(this.rawData))
  }

  // Parse GSI Data
  private parseGsiData = (req: Request, res: Response): void => {
    // Parse Data
    const client = req.body.client
    delete req.body.client
    const gsiData = req.body
    this.rawData = req.body

    // For Testing. Logs whole GSI data into a json file
    this.gsiLogger.toFile(gsiData, 'test.json')

    // Prase Gsi Data
    this.gsiParser.parse(client, gsiData)
    return res.end()
  }
  // Handle Socket Connections
  handleSocketConnections = () => {
    this.socketServer.on('connection', (socket: SocketIO.Socket) => {
      const clientType = socket.handshake.query['client'] as GsiClientObserver

      let rooms = []

      // Assign default rooms by client type
      switch (clientType) {
        // Note: They are all the same for now...
        // Separate these once you realize there are differences between observer types default rooms
        case GsiClientObservers.MAIN:
        case GsiClientObservers.IGDIR:
        case GsiClientObservers.DELAY:
          rooms = [
            `${clientType}_AutomaticOverlayConfig`,
            `${clientType}_DynamicOverlayConfig`
          ]
          socket.join(rooms)
          break
        default:
          this.socketLogger.danger('Connection Failed...')
          return
      }

      this.socketLogger.success(`${clientType} Observer UI connected!`)
      // Subscriptions
      this.handleSocketSubscriptions(socket)

      // Disconnections
      socket.on('disconnect', () => {
        this.socketLogger.notice(`${clientType} disconnected!`)
      })
    })
  }

  // Handle Socket Subscriptions
  handleSocketSubscriptions = (socket: SocketIO.Socket) => {
    socket.on('subscribe', (rooms: string | string[]) => {
      socket.join(rooms)
      this.gsiLogger.info(`Subscribed to: ${rooms}...`)
    })

    socket.on('unsubscribe', (rooms: string | string[]) => {
      if (typeof rooms === 'string') {
        socket.leave(rooms)
      } else {
        rooms.forEach((room) => {
          socket.leave(room)
        })
      }
    })
  }
}
