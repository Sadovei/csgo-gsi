import { GsiPhase } from '../types/gsi/phase-countdowns'
import { GamePhase } from '../types/parsed/phase-countdowns'

export default function phaseParser(data: GsiPhase): GamePhase {
  return {
    phase: data.phase,
    phase_ends_in: data.phase_ends_in
  }
}
