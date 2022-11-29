export interface Redis_ParsedMatchVeto {
  maps: Redis_ParsedMaps
  teams: Array<string>
}

export interface Redis_ParsedMaps {
  [key: string]: Redis_ParsedMap
}

export interface Redis_ParsedMap {
  [key: string]: number | null | string
}
