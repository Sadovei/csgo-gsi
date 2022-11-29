import { GameAllPlayers } from '../types/parsed/all-players'
import { GsiBomb } from '../types/gsi/bomb'
import { GsiGrenades } from '../types/gsi/grenades'
import { GsiMap } from '../types/gsi/map'
import { GsiPhase } from '../types/gsi/phase-countdowns'
import { GsiPlayer } from '../types/gsi/player'
import { WeaponSlotType } from '../types/common/gsi-Data'

export default function radar(
  allPlayers: GameAllPlayers,
  player: GsiPlayer,
  grenades: GsiGrenades,
  map: GsiMap,
  phase: GsiPhase,
  bombState: GsiBomb
): any {
  let finalPlayers: any = {}

  Object.keys(allPlayers).forEach((steamID) => {
    finalPlayers[steamID] = {}
    finalPlayers[steamID].gameData = allPlayers[steamID]
    finalPlayers[steamID].deployedGrenades = {}

    Object.keys(allPlayers[steamID].weapons).forEach((weapon) => {
      finalPlayers[steamID].shoot = false

      if (allPlayers[steamID].weapons[weapon as WeaponSlotType]?.state === 'active') {
        if (Number(allPlayers[steamID].shoot) - 1 === allPlayers[steamID].weapons[weapon as WeaponSlotType]?.ammo_clip) {
          finalPlayers[steamID].shoot = true
          allPlayers[steamID].shoot = allPlayers[steamID].weapons[weapon as WeaponSlotType]?.ammo_clip ? allPlayers[steamID].weapons[weapon as WeaponSlotType]?.ammo_clip : 0
        } else {
          allPlayers[steamID].shoot = allPlayers[steamID].weapons[weapon as WeaponSlotType]?.ammo_clip ? allPlayers[steamID].weapons[weapon as WeaponSlotType]?.ammo_clip : 0
          finalPlayers[steamID].shoot = false
        }
      }
    })

    Object.keys(grenades).forEach((key) => {
      if (grenades[key].owner === Number(steamID))
        finalPlayers[steamID].deployedGrenades[key] = grenades[key]
    })

    if (player.steamid === steamID) finalPlayers[steamID].observed = true
    else finalPlayers[steamID].observed = false
  })

  return {
    players: finalPlayers,
    map: {
      name: map.name,
      round: map.round,
      time: phase.phase_ends_in,
      phase: phase.phase
    },
    bomb: bombState
  }
}
