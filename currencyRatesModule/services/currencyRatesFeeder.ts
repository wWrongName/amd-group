import { CurrencyRateSchema } from '../schemas/currencySchemas'

const CURRENCYFREAKS_URL = process.env.CURRENCYFREAKS_URL
const CURRENCYFREAKS_TOKEN = process.env.CURRENCYFREAKS_TOKEN

export class CurrencyRatesFeeder {
    readonly UPD_TIMEOUT: number = 60 * 1000

    async run() {
        if (await this.isUpdTime()) await this.updateCurrencyRates()
        setTimeout(this.run.bind(this), this.UPD_TIMEOUT)
    }

    async isUpdTime() {
        const currentTime = new Date()
        const hours = currentTime.getHours()
        const minutes = currentTime.getMinutes()
        console.trace(`New UPD Tick. Time: ${currentTime}. ${hours}:${minutes}`)

        const lastUpdTime = await this.getLastUpdTime()
        const diffTime = currentTime.getTime() - lastTime.getTime()
        const diffHours = diffTime / (60 * 60 * 1000)

        if (diffHours > 12)
            return true
        return hours === 12 && minutes === 0
    }

    async getLastUpdTime(): Promise<Date> {
        // TODO - check
    }

    async updateCurrencyRates(): Promise<void> {
        try {
            const rates = this.fetchCurrencyRates()
            // TODO - handle rates
            // TODO - write into DB
        } catch (error) {
            console.error(error)
        }
    }

    async fetchCurrencyRates(): Promise<object> {
        const targetUrl = `${CURRENCYFREAKS_URL}/latest&apikey=${CURRENCYFREAKS_TOKEN}`
        console.trace('Sending request to fetch currency rates:', targetUrl)

        const response = await fetch(targetUrl)
        const currencyRates = <object>await response.json()

        console.trace('Extracting the currency rates response:', currencyRates)
        await CurrencyRateSchema.validateAsync(currencyRates)

        return currencyRates
    }
}
