import Joi from "joi";
import { TICKERS_MODEL } from "../../common/models/tickers";

export const getCurrenciesAll = Joi.object({
    date: Joi.date().iso().required(),
})

export const getCurrenciesCustom = Joi.object({
    base: Joi.string().valid(TICKERS_MODEL).required(),
    target: Joi.string().valid(TICKERS_MODEL).required(),
    date: Joi.date().iso()
})
