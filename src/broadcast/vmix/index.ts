import { Request, Response } from 'express'

import GsiParser from '../../parsers'

export default class VmixHandler {
  private gsiParser: GsiParser

  constructor(gsiParser: GsiParser) {
    this.gsiParser = gsiParser

  }

  handle = (req: Request, res: Response) => {
    const { command } = req.body
    if (command === undefined) {
      res.status(400).send('Invalid Request!').end()
      return
    }

    switch (command) {
      case 'PlayersCamsOut':
        this.gsiParser.cameraToggle = false
        break
      case 'PlayersCamsIn':
        this.gsiParser.cameraToggle = true
        break
      default:
        res
          .status(400)
          .send('Command not Found!')
          .end()
        return
    }
    res.send('Command Executed!').end()
    return
  }
}
