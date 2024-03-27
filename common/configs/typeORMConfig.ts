import { DataSource } from 'typeorm'
import { join } from 'node:path'
import { CurrencyRate, Token } from '../models/CurrencyRate'
import { fileURLToPath } from 'url'
import { dirname } from 'node:path'

const DB_HOST: string = process.env.DB_HOST ?? 'localhost'
const DB_PORT: number = Number(process.env.DB_PORT) ?? 5432
const DB_USER: string = process.env.DB_USER ?? 'test'
const DB_NAME: string = process.env.DB_NAME ?? 'test'
const DB_PASSWORD: string = process.env.DB_PASSWORD ?? 'test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: true,
    entities: [CurrencyRate, Token],
    subscribers: [],
    migrations: [join(__dirname, '../migrations/*')],
})
