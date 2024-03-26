import Joi from 'joi'
import Hapi from '@hapi/hapi'

const HAPI_PORT: number = Number(process.env.HAPI_PORT) ?? 3000

// TODO - put into models?
const TICKERS_MODEL = ['RUB', 'USD', 'EUR']

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
                // TODO - put into schemas
                query: Joi.object({
                    date: Joi.date().iso().required(),
                }),
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
                // TODO - put into schemas
                query: Joi.object({
                    base: Joi.string().valid(TICKERS_MODEL).required(),
                    target: Joi.string().valid(TICKERS_MODEL).required(),
                    date: Joi.date().iso()
                }),
            },
        },
    });

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (error) => {
    console.fatal(error)
})
