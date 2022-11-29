export interface GsiGrenades {
  [key: string]: Grenade
}

type Grenade =
  | GsigrenadeTypes.DecoySmokeGrenade
  | GsigrenadeTypes.DefaultGrenade
  | GsigrenadeTypes.FireBombGrenade

namespace GsigrenadeTypes {
  export interface DecoySmokeGrenade {
    owner: number
    type: 'decoy' | 'smoke'
    position: string
    velocity: string
    lifetime: string
    effecttime: string
  }

  export interface DefaultGrenade {
    owner: number
    type: 'frag' | 'firebomb' | 'flashbang'
    position: string
    velocity: string
    lifetime: string
  }

  export interface FireBombGrenade {
    owner: number
    type: 'inferno'
    lifetime: string
    flames: { [key: string]: string }
  }
}
