import Joi from 'joi'
import Hapi from '@hapi/hapi'
import { getCurrenciesAll, getCurrenciesCustom } from '../schemas/currencySchemas'

const HAPI_PORT: number = Number(process.env.HAPI_PORT) ?? 3000

export const initHAPI = async () => {
    const server = Hapi.server({
        port: HAPI_PORT,
        host: '0.0.0.0',
    })

    server.route({
        method: 'GET',
        path: '/currencies/all',
        handler: async (request: { query: { date: any; }; }) => {
            const date = request.query.date

            const currencies = await currencyService.getCurrenciesByDate(date)

            return currencies
        },
        options: {
            validate: {
                query: getCurrenciesAll
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/currencies/custom',
        handler: async (request: { query: { base: any; target: any; date: any; }; }) => {
            const base = request.query.base
            const target = request.query.target
            const date = request.query.date
            const rate = await currencyService.getCurrencyPairRateByDate(base, target, date)
            return { base, target, rate }
        },
        options: {
            validate: {
                query: getCurrenciesCustom,
            },
        },
    });

    await server.start()
    console.info('Server running on', server.info.uri)

    process.on('unhandledRejection', (error) => {
        console.fatal(error)
    })    
}