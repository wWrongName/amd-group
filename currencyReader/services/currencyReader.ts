import { LessThanOrEqual } from 'typeorm'
import { AppDataSource } from '../../common/configs/typeORMConfig'
import { CurrencyRate } from '../../common/models/CurrencyRate'
import { USDTicker } from '../../common/models/tickers'

async function getCurrencyRatesByDate(date: Date): Promise<CurrencyRate[]> {
    const currencyRateRepository = AppDataSource.getRepository(CurrencyRate)
    const records = await currencyRateRepository.find({
        where: {
            date: LessThanOrEqual(date),
        },
        relations: ['token'],
    })
    return records
}

function filterRecordsByTickers(records: CurrencyRate[], tickers: string[]): CurrencyRate[] {
    return records.filter(record => tickers.includes(record.token.ticker))
}

function sortRecordsByTickers(records: CurrencyRate[], tickers: string[]): (CurrencyRate | undefined)[] {
    return tickers.map(ticker => records.find(record => record.token.ticker === ticker))
}

function countCrossRate(baseToken: CurrencyRate, targetToken: CurrencyRate): number {
    const targetInUsd = 1 / baseToken.usdRate
    const crossRate = targetInUsd * targetToken.usdRate
    return crossRate
}

export class CurrencyRatesReader {
    async run() {}

    /**
     * Returns a map of currency ticker symbols to their exchange rates against the USD for a given date.
     * @param date the date for which to retrieve the exchange rates
     */
    async getCurrenciesByDate(date: Date): Promise<Record<string, string | Date>> {
        const records = await getCurrencyRatesByDate(date)

        const answer: Record<string, string | Date> = {}
        answer.date = date
        answer.base = USDTicker

        records.forEach(record => {
            answer[record.token.ticker] = record.usdRate.toString()
        })
        return answer
    }

    /**
     * Returns the exchange rate between two currencies for a given date.
     * @param date the date for which to retrieve the exchange rates
     * @param targetTicker the ticker symbol of the target currency
     * @param baseTicker the ticker symbol of the base currency (defaults to USD)
     */
    async getCurrencyPairRateByDate(
        date: Date,
        targetTicker: string,
        baseTicker: string = USDTicker,
    ): Promise<Record<string, string | Date>> {
        const records = await getCurrencyRatesByDate(date)

        const answer: Record<string, string | Date> = {}
        answer.date = date
        answer.base = baseTicker
        answer.target = targetTicker

        const unsorted = filterRecordsByTickers(records, [baseTicker, targetTicker])
        const [baseToken, targetToken] = sortRecordsByTickers(unsorted, [baseTicker, targetTicker])

        if (baseToken && targetToken) {
            answer.targetRate = countCrossRate(baseToken, targetToken).toString()
            return answer
        } else return {}
    }
}
