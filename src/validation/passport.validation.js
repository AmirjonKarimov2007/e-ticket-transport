import Joi from "joi";


export const CreatePassportValidator = (data) => {
    const passport = Joi.object({
        serial: Joi.string().required(),
        jsshir: Joi.string().length(14).pattern(/^\d+$/).required(),
        fullname: Joi.string().required(),
        customer_id: Joi.string().required(),

    });
    return passport.validate(data);
}


export const UpdatePassportValidator = (data) => {
    const passport = Joi.object({
        serial: Joi.string().optional(),
        jsshir: Joi.string().length(14).pattern(/^\d+$/).optional(),
        fullname: Joi.string().optional(),
        customer_id: Joi.string().required(),

    });
    return passport.validate(data);
}


