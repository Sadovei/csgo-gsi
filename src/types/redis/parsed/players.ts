export default interface Redis_ParsedPlayers {
  [key: string]: Redis_ParsedPlayer
}

export interface Redis_ParsedPlayer {
  teamName: string
  teamKey: string
  playerKey: string
  nick: string
  seat: string
  steam_id: string
}
