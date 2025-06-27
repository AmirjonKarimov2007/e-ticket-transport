import Joi from "joi";

export const createTransportValidator = (data) => {
    const transport = Joi.object({
        transport_type: Joi.string().required(),
        class:Joi.string().valid('car','bus','poyezd').required(),
        seat:Joi.number().required()
    });
    return transport.validate(data);
}

export const updateTransportValidator = (data) => {
    const transport = Joi.object({
        transport_type: Joi.string().optional(),
        class:Joi.string().valid('car','bus','poyezd').optional(),
        seat:Joi.number().optional()
    });
    return transport.validate(data);
}
