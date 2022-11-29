export interface Redis_TeamData {
  team_name: string
  short_name: string
  team_id: string
  gg_name: string
  players: {
    [key: string]: Redis_Player
  }
}

interface Redis_Player {
  nick: string
  name: string
  flag: string
  seat: string
  steam_id: string
  player_id: string,
}
