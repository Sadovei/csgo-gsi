import { GsiRound } from '../types/gsi/round'
import { GameRound } from '../types/parsed/round'

export default function roundParser(data: GsiRound): GameRound {
  return {
    bomb: data?.bomb ?? '',
    win_team: data?.win_team ?? ''
  }
}
