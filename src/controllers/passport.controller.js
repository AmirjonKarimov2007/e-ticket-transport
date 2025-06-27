import { handleError } from "../helpers/error-handle.js";
import { successRes } from "../helpers/success-response.js";
import Passport from "../models/passport.model.js"
import Customer from "../models/customer.model.js";

import { Token } from "../utils/token-service.js";
import { CreatePassportValidator, UpdatePassportValidator } from "../validation/passport.validation.js"
import { isValidObjectId } from "mongoose";
const token = new Token();


export class PassportController {
    async createPassportInfo(req, res) {
        try {
            const { value, error } = CreatePassportValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            };
            const customer_id = value.customer_id;
            const serial = value.serial;

            const existCustomer = await Customer.findOne({ _id: customer_id });
            const existSerial = await Passport.findOne({ serial: serial });

            if (!existCustomer) {
                return handleError(res, "Passport's Customer not found", 404);
            }
            if (existSerial) {
                return handleError(res, "This Passport is already exists", 409);
            }
            const passportInfo = await Passport.create(value);
            return successRes(res, passportInfo);

        } catch (error) {
            return handleError(res, error);
        };
    };

    async getAllPassportInfo(_, res) {
        try {
            const passportInfos = await Passport.find();
            return successRes(res, passportInfos);
        } catch (error) {
            return handleError(res, error)
        };
    };

    async getPassportById(req, res) {
        try {
            const passport = await PassportController.findPassportByid(res, req.params.id);
            return successRes(res, passport);
        } catch (error) {
            return handleError(res, error)
        };
    };

    async updatePassportInfo(req, res) {
        try {
            const { value, error } = UpdatePassportValidator(req.body)
            if (error) {
                return handleError(res, error, 422);
            };
            const customer_id = value.customer_id;


            const passport = await PassportController.findPassportByid(res, req.params.id)
            const id = req.params.id

            const existCustomer = await Customer.findOne({ _id: customer_id });
            if (!existCustomer) {
                return handleError(res, "Passport's Customer not found", 404);
            }

            const updatedPassport = await Passport.findByIdAndUpdate(id, {
                ...value
            }, { new: true });
            return successRes(res, updatedPassport)


        } catch (error) {
            return handleError(res, error)
        }
    }
    async deletePassportInfo(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) {
                return handleError(res, "Invalid passport ID format", 400);
            }
            const passport = await Passport.findById(id);
            if (!passport) {
                return handleError(res, "Passport not found", 404);
            }
            await Passport.findByIdAndDelete(id);
            return successRes(res, "Passport is deleted");
        } catch (error) {
            return handleError(res, error);
        }
    }


    static async findPassportByid(res, id) {
        try {
            if (!isValidObjectId) {
                return handleError(res, 'Invalid Object id', 400);
            };
            const passportInfo = await Passport.findById(id);
            if (!passportInfo) {
                return handleError(res, "Passport not found");
            };
            return passportInfo;
        } catch (error) {
            return handleError(res, error)
        };
    };
};

