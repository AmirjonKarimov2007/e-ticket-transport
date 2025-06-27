import Joi from "joi";

export const CreateTicketValidator = (data) => {
    const ticket = Joi.object({
        transport_id: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        price: Joi.number().required(),
        departure: Joi.date().optional(),
        arrival: Joi.date().optional(),
        customer_id: Joi.string().required()
    });
    return ticket.validate(data);
}

export const UpdateTicketValidator = (data) => {
    const ticket = Joi.object({
        transport_id: Joi.string().optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        price: Joi.number().optional(),
        departure: Joi.date().optional(),
        arrival: Joi.date().optional(),
        customer_id: Joi.string().optional()
    });
    return ticket.validate(data);
}