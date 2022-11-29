export type Gsi_ObservatorSlotType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface Gsi_PlayerStats {
  kills: number
  assists: number
  deaths: number
  mvps: number
  score: number
}

export interface Gsi_PlayerState {
  health: number
  armor: number
  helmet: boolean
  flashed: number
  smoked: number
  burning: number
  money: number
  round_kills: number
  round_killhs: number
  round_totaldmg: number
  equip_value: number
  defusekit?: boolean
}

export type Gsi_Weapons = {
  [key in WeaponSlotType]?: Weapon
}

export type WeaponSlotType =
  | 'weapon_0'
  | 'weapon_1'
  | 'weapon_2'
  | 'weapon_3'
  | 'weapon_4'
  | 'weapon_5'
  | 'weapon_6'
  | 'weapon_7'
  | 'weapon_8'
  | 'weapon_9'

export type Weapon =
  | weaponTypes.Knife
  | weaponTypes.Pistol
  | weaponTypes.Bomb
  | weaponTypes.Grenade
  | weaponTypes.MachineGun
  | weaponTypes.Rifle
  | weaponTypes.Shotgun
  | weaponTypes.SniperRifle
  | weaponTypes.SubmachineGun

namespace weaponTypes {
  type WeaponState = 'holstered' | 'active'

  export interface Knife {
    type: 'Knife'
    name: 'weapon_knife_t' | 'weapon_knife' | any
    paintkit: string
    state: WeaponState
    ammo_clip?: number
    ammo_clip_max?: number
    ammo_reserve?: number
  }

  export interface Bomb {
    type: 'C4'
    name: 'weapon_c4'
    paintkit: string
    state: WeaponState
    ammo_clip?: number
    ammo_clip_max?: number
    ammo_reserve?: number
  }

  export interface Pistol {
    type: 'Pistol'
    name:
    | 'weapon_deagle'
    | 'weapon_elite'
    | 'weapon_fiveseven'
    | 'weapon_glock'
    | 'weapon_cz75a'
    | 'weapon_hkp2000'
    | 'weapon_p250'
    | 'weapon_revolver'
    | 'weapon_tec9'
    | 'weapon_usp_silencer'
    paintkit: string
    ammo_clip: number
    ammo_clip_max: number
    ammo_reserve: number
    state: WeaponState
  }

  export interface Shotgun {
    type: 'Shotgun'
    name: 'weapon_xm1014' | 'weapon_nova' | 'weapon_mag7' | 'weapon_sawedoff'
    paintkit: string
    ammo_clip: number
    ammo_clip_max: number
    ammo_reserve: number
    state: WeaponState
  }

  export interface MachineGun {
    type: 'Machine Gun'
    name: 'weapon_m249' | 'weapon_negev'
    paintkit: string
    ammo_clip: number
    ammo_clip_max: number
    ammo_reserve: number
    state: WeaponState
  }

  export interface SubmachineGun {
    type: 'Submachine Gun'
    name:
    | 'weapon_mac10'
    | 'weapon_bizon'
    | 'weapon_mp5sd'
    | 'weapon_mp7'
    | 'weapon_mp9'
    | 'weapon_p90'
    | 'weapon_ump45'
    paintkit: string
    ammo_clip: number
    ammo_clip_max: number
    ammo_reserve: number
    state: WeaponState
  }

  export interface Rifle {
    type: 'Rifle'
    name:
    | 'weapon_ak47'
    | 'weapon_aug'
    | 'weapon_famas'
    | 'weapon_galilar'
    | 'weapon_m4a1'
    | 'weapon_m4a1_silencer'
    | 'weapon_sg556'
    paintkit: string
    ammo_clip: number
    ammo_clip_max: number
    ammo_reserve: number
    state: WeaponState
  }

  export interface SniperRifle {
    type: 'SniperRifle'
    name: 'weapon_awp' | 'weapon_g3sg1' | 'weapon_scar20' | 'weapon_ssg08'
    paintkit: string
    ammo_clip: number
    ammo_clip_max: number
    ammo_reserve: number
    state: WeaponState
  }

  export interface Grenade {
    type: 'Grenade'
    name:
    | 'weapon_smokegrenade'
    | 'weapon_decoy'
    | 'weapon_hegrenade'
    | 'weapon_incgrenade'
    | 'weapon_molotov'
    | 'weapon_flashbang'
    paintkit: string
    ammo_clip?: number
    ammo_clip_max?: number
    ammo_reserve: number
    state: WeaponState
  }
}

export type GsiBombState =
  | 'planted'
  | 'planting'
  | 'exploded'
  | 'defusing'
  | 'defused'
  | 'carried'
  | 'dropped'
