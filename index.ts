import { AppDataSource } from './common/configs/typeORMConfig.js'
import { initCurrencyFeeder } from './currencyUpdater/index.js'
import { initCurrencyReader } from './currencyReader/index.js'
import { initLogger } from './iLogger.js'

initLogger()
AppDataSource.initialize()
    .then(() => {
        initCurrencyReader()
        initCurrencyFeeder()
    })
    .catch(error => {
        console.error(error)
    })
