import VmixData from '../../types/common/vmixData'
import VmixHelpers from './helpers'

export default class VmixCommands {
  private vmixHelpers: VmixHelpers
  private playerSeat?: number
  private previouslyPlayerSeat: number
  constructor() {
    this.previouslyPlayerSeat = 0
    this.vmixHelpers = new VmixHelpers()
  }

  PlayersCamsIn(infoCamera: VmixData) {
    this.playerSeat = infoCamera.seat
    if (this.playerSeat) {
      if (this.previouslyPlayerSeat !== this.playerSeat) {
        setTimeout(() => {
          this.vmixHelpers.setLayer(2, `player_${this.playerSeat}`, 'PGM')
          this.vmixHelpers.setLayer(3, `rama_${infoCamera.side}`, 'PGM')
        }, 10)
      }
    } else if ([0, null, undefined].includes(this.playerSeat)) {

      this.vmixHelpers.setLayer(2, 'none', 'PGM')
      this.vmixHelpers.setLayer(3, `none`, 'PGM')
    }
    this.previouslyPlayerSeat = this.playerSeat
  }

  PlayersCamsOut() {
    this.previouslyPlayerSeat = 0
    setTimeout(() => {
      this.vmixHelpers.setLayer(2, 'none', 'PGM')
      this.vmixHelpers.setLayer(3, 'none', 'PGM')
    }, 10)
  }
}
