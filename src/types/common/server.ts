export interface GsiClient {
  type: GsiClientObservers
  status: GsiClientStatus
  auth: GsiClientAuth
}

export type GsiClientObserver = 'main' | 'igdir' | 'delay'

export enum GsiClientObservers {
  MAIN = 'main',
  IGDIR = 'igdir',
  DELAY = 'delay'
}

export enum GsiClientAuth {
  MAIN = 'pgl-gsi-main',
  IGDIR = 'pgl-gsi-igdir',
  DELAY = 'pgl-gsi-delay'
}

export enum GsiClientStatus {
  NONE,
  CONNECTED,
  DISCONNECTED
}

export interface ClientsInfo {
  main: ClientInfo
  delay: ClientInfo
  igdir: ClientInfo
}

interface ClientInfo {
  gameDataReady: boolean
  resetValue: boolean
}
