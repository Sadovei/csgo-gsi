import { GsiBombState } from '../common/gsi-Data'

export interface GameBomb {
  state: GsiBombState
  position: string
  player?: string
  countdown?: string
}
