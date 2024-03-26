import Logger from "./logger.js"
new Logger({
    log_level: 'TRACE',
    colorized_log_level: true,
})

import { initHAPI } from "./hapiModule/routes/currencyRoutes.js"
initHAPI()

import { CurrencyRatesFeeder } from "./currencyRatesModule/services/currencyRatesFeeder.js"
const currencyRatesFeeder = new CurrencyRatesFeeder()
currencyRatesFeeder.run()
