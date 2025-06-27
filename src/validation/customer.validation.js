import Joi from "joi";

export const SignUpCustomerValidator = (data)=>{
    const customer = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required()
    });
    return customer.validate(data);
}
export const SignInCustomerValidator = (data)=>{
    const customer = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional()
    });
    return customer.validate(data);
}


export const ConfirmCustomerValidator = (data)=>{

    const customer = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional(),
        otp: Joi.string().length(6).required()
    });
    
    return customer.validate(data);
}

export const UpdateCustomerValidator = (data)=>{
    const customer = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).optional(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional()
    });
    return customer.validate(data);
}


