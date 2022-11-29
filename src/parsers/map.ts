import { GameMap } from '../types/parsed/map'
import { GsiMap } from '../types/gsi/map'

export default function mapParser(data: GsiMap): GameMap {
  return {
    name: data.name,
    round: data.round,
    team_ct: data.team_ct,
    team_t: data.team_t,
    round_wins: data.round_wins,
    phase: data.phase
  }
}
