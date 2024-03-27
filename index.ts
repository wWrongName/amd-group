import Logger from './logger.js'
new Logger({
    log_level: 'TRACE',
    colorized_log_level: true,
})

import { AppDataSource } from './common/configs/typeORMConfig.js'

import { currencyRatesFeeder } from './currencyFeeder/index.js'
import { initHAPI } from './currencyReader/index.js'
// import { initNATS } from './nats.js'

AppDataSource.initialize().then(() => {
    initHAPI()
    // initNATS()
    currencyRatesFeeder.run()
}).catch(error => {
    console.error(error)
})
