import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class CurrencyRate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    datetime_create: Date

    @Column()
    datetime_update: Date

    @Column({ type: 'enum', enum: ['RUB', 'EUR', 'USD'] })
    currency: string

    @Column({ type: 'float' })
    rate: number
}
