import { GamePlayer } from '../../types/parsed/player'
import { GameSide } from '../../types/parsed'
import Redis_ParsedPlayers from '../../types/redis/parsed/players'
import VmixData from '../../types/common/vmixData'

export default function playerCamera(
    player: GamePlayer,
    playersData: Redis_ParsedPlayers,
    sides: GameSide,
    swap: number
): VmixData {
    if (!playersData[player.steamid]) {
        return {
            steamID: '',
            seat: 0
        }
    }

    let newPlayer: VmixData = {
        steamID: player.steamid,
        seat: swapSeats(swap, Number(playersData[player.steamid].seat), player.observer_slot)
    }

    if (sides.leftSide)
        Object.keys(sides['leftSide'].players).forEach((steamID: string) => {
            if (player.steamid === steamID) { newPlayer.side = sides.leftSide?.side }
        })

    if (sides.rightSide)
        Object.keys(sides['rightSide'].players).forEach((steamID: string) => {
            if (player.steamid === steamID) newPlayer.side = sides.rightSide?.side
        })
    return newPlayer
}

function swapSeats(swap: number, seat: number, playerSlot: number) {
    if (playerSlot !== undefined) {
        if (swap === 0) {
            if (playerSlot > 0 && playerSlot <= 5) {
                return seat
            } else if (playerSlot > 5 || playerSlot === 0) {
                return seat + 5
            } else
                return 0
        } else {
            if (playerSlot > 0 && playerSlot <= 5) {
                return seat + 5
            } else if (playerSlot > 5 || playerSlot === 0) {
                return seat
            } else
                return 0
        }
    } else
        return 0
}