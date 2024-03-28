import { AppDataSource } from '../configs/typeORMConfig'
import { CurrencyRate, Token } from '../models/CurrencyRate'

async function createToken(ticker: string): Promise<Token> {
    const tokenRepository = AppDataSource.getRepository(Token)
    const newToken = new Token()
    newToken.ticker = ticker
    return tokenRepository.save(newToken)
}

async function getTokenByTicker(ticker: string): Promise<Token> {
    const tokenRepository = AppDataSource.getRepository(Token)
    const token = await tokenRepository.findOne({ where: { ticker: ticker } })
    if (!token) return await createToken(ticker)
    return token
}

async function getTokensAll(rates: Record<string, any>): Promise<Record<string, any>> {
    let tokens: Record<string, any> = {}
    for (let ticker of Object.keys(rates)) {
        tokens[ticker] = await getTokenByTicker(ticker)
    }
    return tokens
}

export async function writeCurrencyRates(rates: Record<string, number>, date: Date): Promise<void> {
    const tokens = await getTokensAll(rates)

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
