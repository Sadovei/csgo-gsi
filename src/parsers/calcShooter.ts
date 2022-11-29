export default function calcShooter(allPlayers: any): any {
  let finalPlayers: any = {}

  Object.keys(allPlayers).forEach((steamID) => {
    finalPlayers[steamID] = 0
  })

  return finalPlayers
}
