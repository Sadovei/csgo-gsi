import { GameAllPlayers } from "../types/parsed/all-players"

var roundCounter: number = 0
var playersDisconnected: string[] = []

export function averageDamageRound(infoLiveRound: number, infoLivePhase: string, parsedDataPlayers: GameAllPlayers): void {
    if (infoLiveRound < roundCounter - 1) {
        roundCounter = infoLiveRound
    }

    Object.keys(parsedDataPlayers).forEach(steamID => {
        if (playersDisconnected.indexOf(steamID) === -1) {
            if (parsedDataPlayers[steamID].currentRoundDmg !== parsedDataPlayers[steamID].state.round_totaldmg) {
                if (parsedDataPlayers[steamID].state.round_totaldmg > 0) {
                    parsedDataPlayers[steamID].totalDmg += (parsedDataPlayers[steamID].state.round_totaldmg - parsedDataPlayers[steamID].currentRoundDmg)
                    parsedDataPlayers[steamID].currentRoundDmg = parsedDataPlayers[steamID].state.round_totaldmg
                    if (infoLivePhase === 'live') {
                        if (infoLiveRound === roundCounter) {
                            Object.keys(parsedDataPlayers).forEach(steamIdParsed => {
                                parsedDataPlayers[steamIdParsed].adr = Math.floor(parsedDataPlayers[steamIdParsed].totalDmg / (infoLiveRound + 1))
                            })
                            roundCounter++
                        } else {
                            parsedDataPlayers[steamID].adr = Math.floor(parsedDataPlayers[steamID].totalDmg / (infoLiveRound + 1))
                        }
                    } else {
                        parsedDataPlayers[steamID].adr = Math.floor(parsedDataPlayers[steamID].totalDmg / (infoLiveRound ? infoLiveRound : 1))
                    }
                }
                parsedDataPlayers[steamID].currentRoundDmg = parsedDataPlayers[steamID].state.round_totaldmg
            }
        } else {
            if (Object.keys(parsedDataPlayers).length === 10) {
                playersDisconnected = []
            }
            parsedDataPlayers[steamID].currentRoundDmg = parsedDataPlayers[steamID].state.round_totaldmg
        }
    })

    if (Object.keys(parsedDataPlayers).length < 10) {
        playersDisconnected = Object.keys(parsedDataPlayers).filter(x => !Object.keys(parsedDataPlayers).includes(x));
    }
}