import { GameAllPlayers } from '../../types/parsed/all-players'
import { GameMap } from '../../types/parsed/map'
import { GamePhase } from '../../types/parsed/phase-countdowns'
import { GamePlayer } from '../../types/parsed/player'
import { GameSide } from '../../types/parsed'
import { RightSideOverlay } from '../../types/overlays/right-side'

export default function rightSide(
  parsedPlayers: GameAllPlayers,
  sides: GameSide,
  map: GameMap,
  player: GamePlayer,
  phase: GamePhase
): RightSideOverlay {
  function checkGrenades(object: any) {
    const grenades = [
      'weapon_smokegrenade',
      'weapon_hegrenade',
      'weapon_incgrenade',
      'weapon_molotov',
      'weapon_flashbang'
    ]

    let totalGrenades: any = {
      weapon_smokegrenade: 0,
      weapon_hegrenade: 0,
      weapon_incgrenade: 0,
      weapon_molotov: 0,
      weapon_flashbang: 0
    }

    Object.keys(object).forEach((weapon) => {
      grenades.forEach((grenade: string) => {
        if (object[weapon].name === grenade) {
          totalGrenades[grenade] += object[weapon].ammo_reserve
        }
      })
    })
    return totalGrenades
  }

  const bonus = [0, 1400, 1900, 2400, 2900, 3400]
  let allGrenades: any = {
    weapon_smokegrenade: 0,
    weapon_hegrenade: 0,
    weapon_incgrenade: 0,
    weapon_molotov: 0,
    weapon_flashbang: 0
  }
  let moneySpend = 0
  let remainingMoney = 0

  let objOverlay: RightSideOverlay = {
    side: sides?.rightSide ? sides.rightSide.side : '',
    utility: allGrenades,
    economy: {
      roundLose: sides?.rightSide ? (sides.rightSide.side === 'CT'
        ? map.team_ct.consecutive_round_losses
        : map.team_t.consecutive_round_losses) : 0,
      bonus: sides?.rightSide ? (sides.rightSide.side === 'CT'
        ? (map.team_ct.consecutive_round_losses > 5
          ? 3400
          : bonus[map.team_ct.consecutive_round_losses])
        : (map.team_t.consecutive_round_losses > 5
          ? 3400
          : bonus[map.team_t.consecutive_round_losses])) : 0,
      eq_value: 0,
      remaining_money: 0
    },
    players: {},
    roundPhase: {
      phase: phase.phase,
      phase_ends_in: phase.phase_ends_in
    }
  }

  sides?.rightSide && Object.keys(sides.rightSide.players).forEach((playerSteam) => {
    if (parsedPlayers[playerSteam]) {
      let objPlayer: any = {}

      objPlayer.playerName = parsedPlayers[playerSteam].playerName
      objPlayer.playerKey = parsedPlayers[playerSteam].playerKey
      objPlayer.teamKey = parsedPlayers[playerSteam].teamKey
      objPlayer.observer_slot = parsedPlayers[playerSteam]?.observer_slot
      objPlayer.state = parsedPlayers[playerSteam]?.state
      objPlayer.match_stats = parsedPlayers[playerSteam]?.match_stats
      objPlayer.weapons = parsedPlayers[playerSteam]?.weapons
      objPlayer.active = playerSteam === player?.steamid ? true : false
      objPlayer.adr = parsedPlayers[playerSteam]?.adr
      objOverlay.players[playerSteam] = objPlayer

      let playerGrenades = checkGrenades(parsedPlayers[playerSteam]?.weapons)
      Object.keys(playerGrenades).forEach((grenade) => {
        allGrenades[grenade] += playerGrenades[grenade]
      })
      moneySpend += parsedPlayers[playerSteam].state?.equip_value
      remainingMoney += parsedPlayers[playerSteam]?.state.money
    }
  })

  objOverlay.utility = allGrenades
  objOverlay.economy.eq_value = moneySpend
  objOverlay.economy.remaining_money = remainingMoney
  return objOverlay
}
