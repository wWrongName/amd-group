import Logger from './common/utils/logger.js'

export function initLogger(): void {
    new Logger({
        log_level: 'TRACE',
        colorized_log_level: true,
    })
}
