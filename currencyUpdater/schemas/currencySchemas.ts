import Joi from 'joi'

export const CurrencyRateSchema = Joi.object().pattern(Joi.string(), Joi.number().positive())
