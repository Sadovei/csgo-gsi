import { GameMap } from '../../types/parsed/map'
import { GamePhase } from '../../types/parsed/phase-countdowns'
import { GameRound } from '../../types/parsed/round'
import { GameSide } from '../../types/parsed'
import { Redis_ParsedMatchVeto } from '../../types/redis/parsed/match-veto'
import { TopBarOverlay } from '../../types/overlays/top-bar'

export default function topBar(
  map: GameMap,
  round: GameRound,
  phase: GamePhase,
  redisMap: Redis_ParsedMatchVeto | undefined,
  sides: GameSide,
  bombState: any,
  lastMVP: any,
  teamOnFire: any
): TopBarOverlay {
  let objOverlay: TopBarOverlay = {
    round: {
      phase: phase.phase,
      time: phase.phase_ends_in,
      bomb: round.bomb ?? '',
      win_team: round.win_team ?? '',
      bombState: bombState
    },
    leftSide: {
      score: sides.leftSide ? sides.leftSide.score : 0,
      name: sides.leftSide ? sides.leftSide.teamName : '',
      nameKey: sides.leftSide ? sides.leftSide.teamKey : '',
      sideTeam: sides.leftSide ? sides.leftSide.side : '',
      timeouts_remaining: sides.leftSide ? sides.leftSide.timeouts_remaining : 0,
      players: sides.leftSide ? sides.leftSide.players : []
    },
    rightSide: {
      score: sides.rightSide ? sides.rightSide.score : 0,
      name: sides.rightSide ? sides.rightSide.teamName : '',
      nameKey: sides.rightSide ? sides.rightSide.teamKey : '',
      sideTeam: sides.rightSide ? sides.rightSide.side : '',
      timeouts_remaining: sides.rightSide ? sides.rightSide.timeouts_remaining : 0,
      players: sides.rightSide ? sides.rightSide.players : []
    },
    mapInfo: {
      currentRound: map.round,
      bestOf: redisMap ? Object.keys(redisMap.maps).length : 1,
      vetoLegend: redisMap ? redisMap.maps : {},
      phase: map.phase,
      mvps: lastMVP,
      teamOnFire: teamOnFire,
      historyRounds: map?.round_wins ? map?.round_wins : {},
      mapName: map.name
    }
  }
  return objOverlay
}
