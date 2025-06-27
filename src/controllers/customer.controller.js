import { handleError } from "../helpers/error-handle.js";
import { successRes } from "../helpers/success-response.js";
import { SignUpCustomerValidator, SignInCustomerValidator, ConfirmCustomerValidator,UpdateCustomerValidator } from "../validation/customer.validation.js";
import Customer from "../models/customer.model.js";
import { isValidObjectId } from "mongoose";
import { generateOTP } from "../helpers/generate-otp.js";
import NodeCache from "node-cache";
import config from '../config/index.js'
import { transporter } from '../helpers/send-mail.js'
import { sendOTPbyKarimov } from '../helpers/sms-send.js'
import { Token } from "../utils/token-service.js";

const cache = new NodeCache();
const token = new Token();

export class CustomerController {
    async SignUp(req, res) {
        const { value, error } = SignUpCustomerValidator(req.body)
        if (error) {
            return handleError(res, error, 422)
        };
        const existPhoneNumber = await Customer.findOne({ phoneNumber: value.phoneNumber })
        const existEmail = await Customer.findOne({ email: value.email })
        if (existPhoneNumber) {
            return handleError(res, 'Phone Number already exists', 409);
        };
        if (existEmail) {
            return handleError(res, 'Email  already exists', 409);
        };

        const customer = await Customer.create(value);
        const payload = { id: customer._id };
        const accessToken = await token.generateAccessToken(payload);
        const refreshToken = await token.generateRefreshToken(payload);
        res.cookie('refreshTokenCustomer', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return successRes(res, {
            data: customer,
            token: accessToken
        }, 201);

    };



    async SignIn(req, res) {
        try {
            const { value, error } = SignInCustomerValidator(req.body)
            if (error) {
                return handleError(res, error, 422)
            };

            const existsEmail = await Customer.findOne({ email: value.email })
            if (!existsEmail) {
                return handleError(res, 'Email is not defined', 404);
            };

            const otp = generateOTP()
            cache.set(value.email, otp, 120)
            const mailOptions = {
                from: config.MAIL_USER,
                to: value.email,
                subject: 'Taxi verification code',
                text:otp

            }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                    return handleError(res,"error on otp")
                }
                console.log(info)
            });



            return successRes(res, {
                message: "otp send successfully to Email"
            })
        } catch (error) {
            return handleError(res, error)
        }

    };
    async confirmSignIn(req, res) {
        try {
            const { value, error } = ConfirmCustomerValidator(req.body)
            if (error) {
                return handleError(res, error, 422)
            };
            const customer = await Customer.findOne({ email: value.email })
            const existsEmail = await Customer.findOne({ email: value.email })
            if (!existsEmail) {
                return handleError(res, 'Email is not defined', 404);
            };
            const cacheOTP = cache.get(value.email)
            if (!cacheOTP || cacheOTP != value.otp) {
                return handleError(res, "OTP is expires", 400)

            };
            const payload = { id: customer._id };

            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return successRes(res, {
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            return handleError(res, error)
        }
    }



    async getAllCustomers(req, res) {
        try {
            const customers = await Customer.find().populate('passports')
            return successRes(res, customers)
        } catch (error) {
            return handleError(res, error)
        }
    };
    async getCustomerByid(req, res) {
        try {
            const id = req.params.id;
            const customer = await Customer.findById(id).populate('passports');

            if (!customer) {
                return handleError(res, "Customer not found", 404);
            }

            return successRes(res, customer);
        } catch (error) {
            console.error("getCustomerByid error:", error);
            return handleError(res, "Internal server error", 500);
        }
    }





    async updateCustomer(req, res) {
        try {
            const id = req.params.id
            const customer = await CustomerController.findCustomerByid(res, id)
            if (!customer) {
                return handleError(res, "Customer not found", 404)
            }
            const { value, error } = UpdateCustomerValidator(req.body)
            if (error) {
                return handleError(res, error, 422)
            }
            const updatedCustomer = await Customer.findByIdAndUpdate(id, {
                ...value
            });
            return successRes(res, updatedCustomer)


        } catch (error) {
            return handleError(res, error)
        }
    };
    async deleteCustomer(req, res) {
        try {
            const id = req.params.id;
            await CustomerController.findCustomerByid(res, id);
            await Customer.findByIdAndDelete(id);
            return successRes(res, { message: 'Customer deleted successfully' });
        } catch (error) {
            return handleError(res, error);
        }
    }


    static async findCustomerByid(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, 'Invalid object ID', 400);
            }
            const customer = await Customer.findById(id);
            if (!customer) {
                return handleError(res, 'Customer not found', 404);
            };
            return customer;
        } catch (error) {
            return handleError(res, error)
        }
    };
    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer;
            if (!refreshToken) {
                return handleError(res, 'Refresh token epxired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return handleError(res, 'Invalid token', 400);
            }
            const customer = await Customer.findById(decodedToken.id);
            if (!customer) {
                return handleError(res, 'Customer not found', 404);
            }
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload);
            return successRes(res, {
                token: accessToken
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async logOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer;
            if (!refreshToken) {
                return handleError(res, 'Refresh token epxired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return handleError(res, 'Invalid token', 400);
            }
            const customer = await Customer.findById(decodedToken.id);
            if (!customer) {
                return handleError(res, 'Customer not found', 404);
            }
            res.clearCookie('refreshTokenCustomer');
            return successRes(res, {});
        } catch (error) {
            return handleError(res, error);
        }
    }
}

