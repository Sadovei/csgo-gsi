export enum logColors {
  Reset = '\x1b[0m',
  Red = '\x1b[31m',
  Green = '\x1b[32m',
  LightGreen = '\x1b[92m',
  Yellow = '\x1b[93m',
  Blue = '\x1b[34m',
  Cyan = '\x1b[96m',
  Magenta = '\x1b[95m',
  Grey = '\x1b[90m'
}

export class Logger {
  private type = ''
  private typeString = ''

  constructor(type: string, color: logColors) {
    this.typeString = type
    this.type = `${color}[${type}]`
  }

  print(message: string, color?: logColors) {
    const logColor = color || logColors.Reset
    console.log(`${this.type} ${logColor}${message}${logColors.Reset}`)
  }

  notice(message: string) {
    const logColor = logColors.Magenta
    this.print(message, logColor)
  }

  success(message: string) {
    const logColor = logColors.Green
    this.print(message, logColor)
  }

  info(message: string) {
    const logColor = logColors.Blue
    this.print(message, logColor)
  }

  warning(message: string) {
    const logColor = logColors.Yellow
    this.print(message, logColor)
  }

  danger(message: string) {
    const logColor = logColors.Red
    this.print(message, logColor)
  }

  alert(message: string) {
    const logColor = logColors.Cyan
    this.print(message, logColor)
  }

  active(message: string) {
    const logColor = logColors.LightGreen
    this.print(message, logColor)
  }

  inactive(message: string) {
    const logColor = logColors.Grey
    this.print(message, logColor)
  }

  box(message: string, boxColor?: logColors) {
    boxColor = boxColor || logColors.Reset
    var messageLength = this.typeString.length + message.length + 3

    console.log(`${boxColor}╔══${'═'.repeat(messageLength)}══╗
║  ${this.type} ${logColors.Reset}${message}${boxColor}  ║
╚══${'═'.repeat(messageLength)}══╝${logColors.Reset}`)
  }

  toFile(data: any, filename: string) {
    const fs = require('fs')
    fs.writeFile(`./${filename}`, JSON.stringify(data), function (err: string) {
      if (err) {
        return console.log(err)
      }
    })
  }
}
