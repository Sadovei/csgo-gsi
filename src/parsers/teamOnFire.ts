import { GsiMap_RoundWin } from '../types/gsi/map'

export default function teamOnFire(roundsInfo: GsiMap_RoundWin, round: number): any {
    let winsRowT = 0
    let winsRowCT = 0

    Object.keys(roundsInfo).forEach((round, roundIndex) => {
        if (Object.keys(roundsInfo).length < 15) {
            if (roundsInfo[round].charAt(0) === 't') {
                winsRowT += 1
                winsRowCT = 0
            } else if (roundsInfo[round].charAt(0) === 'c') {
                winsRowCT += 1
                winsRowT = 0
            }
        } else if (Object.keys(roundsInfo).length > 15 && Object.keys(roundsInfo).length < 30) {
            if (roundIndex > 14) {
                if (roundsInfo[round].charAt(0) === 't') {
                    winsRowT += 1
                    winsRowCT = 0
                } else if (roundsInfo[round].charAt(0) === 'c') {
                    winsRowCT += 1
                    winsRowT = 0
                }
            }
        }
    })

    if (round < 30) {
        if (winsRowCT > 4)
            return 'CT'
        else if (winsRowT > 4)
            return 'T'
    }

    return 'none'
}
