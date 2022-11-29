import http from 'http'

export default class VmixHelpers {
  private baseUrl: string

  constructor() {
    this.baseUrl = `http://${process.env.STREAM === 'a' ? '10.99.4.32' : '10.99.4.33'}:8088/api/?Function`
  }

  async get(url: string) {
    const req = http.get(url)
    req.on('error', () => {
      console.log(`Can't access vMix API enpoint: ${this.baseUrl}`)
    })
  }

  setLayer(
    layerNumber: number,
    layerSource: string | number, //accepts "none" as layerSource, very useful for resetting or defaulting
    inputName: string
  ) {
    this.get(
      `${this.baseUrl}=SetLayer&Value=${layerNumber},${layerSource}&Input=${inputName}`
    )
  }

  setPosition(inputName: string, miliseconds: number) {
    this.get(
      `${this.baseUrl}=SetPosition&Value=${miliseconds}&Input=${inputName}`
    )
  }
}
