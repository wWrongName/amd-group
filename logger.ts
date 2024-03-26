import process from 'node:process'

const log_levels = {
    trace: {
        style: '\x1b[96m',
        mnemonic: 'TRACE',
        level: 0,
    },
    debug: {
        style: '\x1b[94m',
        mnemonic: 'DEBUG',
        level: 1,
    },
    info: {
        style: '\x1b[37m',
        mnemonic: 'INFO',
        level: 2,
    },
    warn: {
        style: '\x1b[33m',
        mnemonic: 'WARN',
        level: 3,
    },
    error: {
        style: '\x1b[31m',
        mnemonic: 'ERROR',
        level: 4,
    },
    fatal: {
        style: '\x1b[41m\x1b[30m',
        mnemonic: 'FATAL',
        level: 5,
    },
}
const defaultConfig = {
    log_level: 2, // mnemonic "info" or level "2"
    colorized_log_level: true,
    maximized_log: true,
    gui_output: false,
}

class Logger {
    config:
        | ({
              log_level: number // mnemonic "info" or level "2"
              colorized_log_level: boolean
              maximized_log: boolean
              gui_output: boolean
          } & object)
        | undefined

    constructor(config: object) {
        let checkProps = function () {
            const model = Object.keys(defaultConfig)
            model.forEach(key => {
                if (!Object.hasOwn(config, key)) console.log(`Property '${key}' was not detected. Set default value`)
            })
        }
        let mergeConfigs = () => {
            this.config = Object.assign(defaultConfig, config)
        }
        let findLogLevel = function (level: string) {
            let mnemonic = level.toUpperCase()
            let res = Object.keys(log_levels).find(level => log_levels[level].mnemonic === mnemonic)
            if (res) return log_levels[res].level
        }
        let setDefaultLogLevel = function (invalid_value: string) {
            config.log_level = defaultConfig.log_level
            console.log(`Property 'log_level' (invalid value) '${invalid_value}'. Set default log level 'info'"`)
        }
        let validate = function () {
            let ll = config.log_level
            if (Number.isNaN(Number(ll))) {
                if (typeof ll === 'string') {
                    let level = findLogLevel(ll)
                    if (level === undefined) setDefaultLogLevel(ll)
                    else config.log_level = level
                } else {
                    setDefaultLogLevel(ll)
                }
            } else {
                if (ll > -1 && ll < 6) config.log_level = Number(ll)
                else setDefaultLogLevel(ll)
            }
        }

        checkProps()
        validate()
        mergeConfigs()
        this.setMethods()
    }

    setMethods() {
        console.trace = this.trace.bind(this)
        console.debug = this.debug.bind(this)
        console.info = this.info.bind(this)
        console.warn = this.warn.bind(this)
        console.error = this.error.bind(this)
        console.fatal = this.fatal.bind(this)
    }

    getDateTime() {
        return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }

    log(method: { style: any; mnemonic: any; level: any }, ...args: any[]) {
        if (method.level < this.config.log_level) return
        let dateTime = `[${this.getDateTime()}]`
        let mnemonic = `[${method.mnemonic}]${method.mnemonic.length === 4 ? ' ' : ''}`
        if (this.config.colorized_log_level) console.log(dateTime, method.style, mnemonic, '\x1b[0m', ...args)
        else console.log(dateTime, mnemonic, ...args)
    }

    trace(...args: any[]) {
        this.log(log_levels.trace, ...args)
    }

    debug(...args: any[]) {
        this.log(log_levels.debug, ...args)
    }

    info(...args: any[]) {
        this.log(log_levels.info, ...args)
    }

    warn(...args: any[]) {
        this.log(log_levels.warn, ...args)
    }

    error(...args: any[]) {
        this.log(log_levels.error, ...args)
    }

    fatal(...args: any[]) {
        this.log(log_levels.fatal, ...args)
        process.exit(1)
    }
}

export default Logger
