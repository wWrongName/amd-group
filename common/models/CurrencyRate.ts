import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { Token } from './Token'

@Entity()
class CurrencyRate {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Token)
    @JoinColumn()
    token!: Token

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Index()
    date!: Date

    @Column({ type: 'decimal', precision: 10, scale: 4 })
    usdRate!: number
}

export { CurrencyRate, Token }
