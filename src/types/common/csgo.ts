export type PhaseMap = 'live' | 'intermission' | 'gameover' | 'warmup'

export type TeamType = 'CT' | 'T' | ''

export type BombType = 'planted' | 'defused' | 'exploded' | ''

export type RoundWinningType =
  | 'ct_win_time'
  | 'ct_win_elimination'
  | 'ct_win_defuse'
  | 't_win_elimination'
  | 't_win_bomb'

export type PhaseExt =
  | 'freezetime'
  | 'bomb'
  | 'warmup'
  | 'live'
  | 'over'
  | 'defuse'
  | 'paused'
  | 'timeout_ct'
  | 'timeout_t'
