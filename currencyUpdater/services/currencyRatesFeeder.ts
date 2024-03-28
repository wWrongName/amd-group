import { TICKERS_MODEL } from '../../common/models/tickers'
import { CurrencyRateSchema } from '../schemas/currencySchemas'
import { CurrencyRate, Token } from '../../common/models/CurrencyRate'
import { AppDataSource } from '../../common/configs/typeORMConfig'
import { sendCourseUpdate } from './currencyRatesDealer'
import { writeCurrencyRates } from '../../common/services/general'
import { fillDataBaseWithRandomRates } from './currencyRatesFiller'

const CURRENCYFREAKS_URL = process.env.CURRENCYFREAKS_URL
const CURRENCYFREAKS_TOKEN = process.env.CURRENCYFREAKS_TOKEN

async function getLastRate(): Promise<Date> {
    const currencyRateRepository = AppDataSource.getRepository(CurrencyRate)
    const lastRecord = await currencyRateRepository.find({
        order: { date: 'DESC' },
        take: 1,
    })
    const desiredRecord = lastRecord[0]
    if (desiredRecord) return desiredRecord.date
    return new Date(0)
}

class CurrencyRatesFeeder {
    readonly UPD_TIMEOUT: number = 60 * 1000
    readonly SYMBOLS: string = TICKERS_MODEL.join(',')

    /**
     * Runs the currency rates feeder.
     *
     * This function continuously polls the CurrencyFreaks API for the latest currency rates
     * and updates the database. It also sends a message to the Discord channel to notify
     * the users of the updated rates.
     *
     * @remarks
     * This function is designed to be run as a background process. It will periodically check
     * if it is time to update the rates and then update them if necessary.
     */
    public async run(): Promise<void> {
        const lastUpdTime = await this.getLastUpdTime()
        if (this.isUpdTime(lastUpdTime)) {
            const [rates, date] = await this.updateCurrencyRates()
            await sendCourseUpdate({
                rates,
                date,
            })
        }
        setTimeout(this.run.bind(this), this.UPD_TIMEOUT)
    }

    /**
     * Checks if it is time to update the currency rates.
     *
     * @param lastUpdTime - The date of the last time the rates were updated.
     * @returns `true` if it is time to update the rates, `false` otherwise.
     */
    private isUpdTime(lastUpdTime: Date): boolean {
        const currentTime = new Date()
        const hours = currentTime.getHours()
        const minutes = currentTime.getMinutes()
        console.trace(`New UPD Tick. Time: ${currentTime}. ${hours}:${minutes}`)

        const diffTime = currentTime.getTime() - lastUpdTime.getTime()
        const hour = 60 * 60 * 1000
        const diffHours = diffTime / hour
        console.trace(`Last update: ${Math.floor(diffHours)}h ago`)

        if (diffHours > 24) return true
        return hours === 24 && minutes === 0
    }

    /**
     * Gets the date of the last time the currency rates were updated from database.
     *
     * @returns The date of the last time the rates were updated.
     */
    private async getLastUpdTime(): Promise<Date> {
        return await getLastRate()
    }

    /**
     * Updates the currency rates from the CurrencyFreaks API.
     *
     * @returns An array containing the updated rates and the date of the update.
     */
    private async updateCurrencyRates(): Promise<[object, Date]> {
        try {
            const [rates, date] = await this.fetchCurrencyRates()
            await writeCurrencyRates(rates, date)
            return [rates, date]
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Fetches the latest currency rates from the CurrencyFreaks API.
     *
     * @returns An array containing the latest rates and the date of the update.
     */
    private async fetchCurrencyRates(): Promise<[Record<string, number>, Date]> {
        const targetUrl = `${CURRENCYFREAKS_URL}/latest?apikey=${CURRENCYFREAKS_TOKEN}&symbols=${this.SYMBOLS}`
        console.trace('Sending request to fetch currency rates:', targetUrl)

        const response = await fetch(targetUrl)
        const currencyData = <any>await response.json()
        console.trace('Extracting the currency rates response:', currencyData)

        await CurrencyRateSchema.validateAsync(currencyData.rates)
        return [currencyData.rates, currencyData.date]
    }
}

/**
 * Runs the currency rates feeder.
 *
 * This function continuously polls the CurrencyFreaks API for the latest currency rates
 * and updates the database. It also sends a message to the nuts channel to notify
 * about updated rates.
 *
 * @remarks
 * This function is designed to be run as a background process. It will periodically check
 * if it is time to update the rates and then update them if necessary.
 * Also pre-run random rates filler. 
 */
export function initCurrencyFeeder(): void {
    const currencyRatesFeeder = new CurrencyRatesFeeder()
    fillDataBaseWithRandomRates()
    currencyRatesFeeder.run()
}
