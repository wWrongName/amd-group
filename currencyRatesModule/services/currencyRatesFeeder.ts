import { TICKERS_MODEL } from '../../common/models/tickers'
import { CurrencyRateSchema } from '../schemas/currencySchemas'
import { CurrencyRate, Token } from '../../common/models/currencies'
import { AppDataSource } from '../../common/configs/typeORMConfig'

const CURRENCYFREAKS_URL = process.env.CURRENCYFREAKS_URL
const CURRENCYFREAKS_TOKEN = process.env.CURRENCYFREAKS_TOKEN

async function getLastRate(): Promise<Date> {
    const currencyRateRepository = AppDataSource.getRepository(CurrencyRate)
    const lastRecord = await currencyRateRepository.findOne({
        order: {
            date: 'DESC',
        },
    })
    if (lastRecord) return lastRecord.date
    return new Date(0)
}

async function createToken(ticker: string) {
    const tokenRepository = AppDataSource.getRepository(Token)
    const newToken = new Token()
    newToken.ticker = ticker
    return tokenRepository.save(newToken)
}

async function getTokenByTicker(ticker: string) {
    const tokenRepository = AppDataSource.getRepository(Token)
    const token = await tokenRepository.findOne({ where: { ticker: ticker } })
    if (!token) return await createToken(ticker)
    return token
}

async function getTokensAll(rates: Record<string, any>) {
    let tokens: Record<string, any> = {}
    for (let ticker of Object.keys(rates)) {
        tokens[ticker] = await getTokenByTicker(ticker)
    }
    return tokens
}

async function writeCurrencyRates(rates: Record<string, any>) {
    const tokens = await getTokensAll(rates)
    const date = new Date()

    await AppDataSource.transaction('READ COMMITTED', async transactionalEntityManager => {
        for (let ticker in rates) {
            const currencyRate = new CurrencyRate()
            currencyRate.date = date
            currencyRate.token = tokens[ticker]
            currencyRate.usdRate = rates[ticker]
            transactionalEntityManager.save(currencyRate)
        }
    })
}

export class CurrencyRatesFeeder {
    readonly UPD_TIMEOUT: number = 60 * 1000
    readonly SYMBOLS: string = TICKERS_MODEL.join(',')

    public async run(): Promise<void> {
        const lastUpdTime = await this.getLastUpdTime()
        if (this.isUpdTime(lastUpdTime)) await this.updateCurrencyRates()
        setTimeout(this.run.bind(this), this.UPD_TIMEOUT)
    }

    private isUpdTime(lastUpdTime: Date): boolean {
        const currentTime = new Date()
        const hours = currentTime.getHours()
        const minutes = currentTime.getMinutes()
        console.trace(`New UPD Tick. Time: ${currentTime}. ${hours}:${minutes}`)

        const diffTime = currentTime.getTime() - lastUpdTime.getTime()
        const hour = 60 * 60 * 1000
        const diffHours = diffTime / hour
        console.trace(`Last update: ${diffHours}h ago`)

        if (diffHours > 12) return true
        return hours === 12 && minutes === 0
    }

    private async getLastUpdTime(): Promise<Date> {
        return await getLastRate()
    }

    private async updateCurrencyRates(): Promise<void> {
        try {
            const rates = await this.fetchCurrencyRates()
            await writeCurrencyRates(rates)
        } catch (error) {
            console.error(error)
        }
    }

    private async fetchCurrencyRates(): Promise<object> {
        const targetUrl = `${CURRENCYFREAKS_URL}/latest&apikey=${CURRENCYFREAKS_TOKEN}&symbols=${this.SYMBOLS}`
        console.trace('Sending request to fetch currency rates:', targetUrl)

        const response = await fetch(targetUrl)
        const currencyData = <any>await response.json()
        console.trace('Extracting the currency rates response:', currencyData)

        await CurrencyRateSchema.validateAsync(currencyData.rates)
        return currencyData.rates
    }
}
