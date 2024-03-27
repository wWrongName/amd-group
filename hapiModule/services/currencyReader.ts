import { AppDataSource } from '../../common/configs/typeORMConfig'
import { CurrencyRate } from '../../common/models/currencies'
import { USDTicker } from '../../common/models/tickers'

async function getCurrencyRatesByDate(date: Date): Promise<CurrencyRate[]> {
    const currencyRateRepository = AppDataSource.getRepository(CurrencyRate)
    const records = await currencyRateRepository.find({
        where: {
            date: date,
        },
    })
    return records
}

function filterRecordsByTickers(records: CurrencyRate[], tickers: string[]): CurrencyRate[] {
    return records.filter(record => tickers.includes(record.token.ticker))
}

function sortRecordsByTickers(records: CurrencyRate[], tickers: string[]): (CurrencyRate)[] {
    return tickers.map(ticker => records.find(record => record.token.ticker === ticker))
}

function countCrossRate(baseToken: CurrencyRate, targetToken: CurrencyRate): number {
    const targetInUsd = 1 / targetToken.usdRate
    const crossRate = targetInUsd * baseToken.usdRate
    return crossRate
}

export class CurrencyRatesReader {
    async run() {}

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

    async getCurrencyPairRateByDate(date: Date, targetTicker: string, baseTicker: string = USDTicker) {
        const records = await getCurrencyRatesByDate(date)

        const answer: Record<string, string | Date> = {}
        answer.date = date
        answer.base = baseTicker
        answer.target = targetTicker

        const unsorted = filterRecordsByTickers(records, [baseTicker, targetTicker])
        const [baseToken, targetToken] = sortRecordsByTickers(unsorted, [baseTicker, targetTicker])
        
        answer.targetRate = countCrossRate(baseToken, targetToken).toString()
        return answer
    }
}
