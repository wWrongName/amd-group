import { TICKERS_MODEL } from '../../common/models/tickers'
import { writeCurrencyRates } from '../../common/services/general'

const AMOUNT_OF_RECORDS = 10

function generateRandomRate() {
    // from 0 to 100
    return Math.random() * 100
}

function generateRecord(): Record<string, number> {
    return TICKERS_MODEL.reduce((prev, cur) => {
        prev[cur] = generateRandomRate()
        return prev
    }, {})
}

function generateRecords(): Record<string, number>[] {
    const records = []
    for (let i = 0; i < AMOUNT_OF_RECORDS; i++) {
        records.push(generateRecord())
    }
    return records
}

/**
 * Fills the database with random currency rates at zero date-time.
 * @returns {Promise<void>}
 */
export async function fillDataBaseWithRandomRates(): Promise<void> {
    const ratesArray = generateRecords()
    for (let rates of ratesArray) {
        await writeCurrencyRates(rates, new Date(0))
    }
}
