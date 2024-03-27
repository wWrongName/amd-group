import Hapi from '@hapi/hapi'
import { getCurrenciesAll, getCurrenciesCustom } from '../schemas/currencySchemas'
import { CurrencyRatesReader } from '../services/currencyReader'

const HAPI_PORT: number = Number(process.env.HAPI_PORT) ?? 3000
const currencyRatesReader = new CurrencyRatesReader()

async function currenciesAllHandler(request: { query: { date: any } }): Promise<Record<string, string | Date>> {
    const date = request.query.date
    const currencies = await currencyRatesReader.getCurrenciesByDate(date)
    return currencies
}

async function currenciesCustomHandler(request: { query: { base: any; target: any; date: any } }) {
    const base = request.query.base
    const target = request.query.target
    const date = request.query.date
    return await currencyRatesReader.getCurrencyPairRateByDate(date, target, base)
}

export const initHAPI = async () => {
    const server = Hapi.server({
        port: HAPI_PORT,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Content-Type'],
                additionalHeaders: ['X-Requested-With'],
            },
        },
    })

    server.route({
        method: 'GET',
        path: '/currencies/all',
        handler: currenciesAllHandler,
        options: {
            validate: {
                query: getCurrenciesAll,
            },
        },
    })

    server.route({
        method: 'GET',
        path: '/currencies/custom',
        handler: currenciesCustomHandler,
        options: {
            validate: {
                query: getCurrenciesCustom,
            },
        },
    })

    await server.start()
    console.info('Server running on', server.info.uri)

    process.on('unhandledRejection', error => {
        console.fatal(error)
    })
}
