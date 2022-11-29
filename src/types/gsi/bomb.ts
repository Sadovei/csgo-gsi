import { GsiBombState } from '../common/gsi-Data'

export interface GsiBomb {
  state: GsiBombState
  position: string
  player?: string
  countdown?: string
}
