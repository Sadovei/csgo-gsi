export interface Redis_MatchVeto {
  maps: Redis_Map
  day: number
  match: number
}

interface Redis_Map {
  [key: string]: Redis_InfoMap
}

interface Redis_InfoMap {
  [key: string]: string | number
}
