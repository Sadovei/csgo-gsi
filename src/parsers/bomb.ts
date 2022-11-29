import { GsiBomb } from '../types/gsi/bomb'
import { GameBomb } from '../types/parsed/bomb'

export default function bombParser(data: GsiBomb): GameBomb {
  return {
    state: data.state,
    position: data.position,
    player: data?.player ?? '',
    countdown: data?.countdown ?? ''
  }
}
