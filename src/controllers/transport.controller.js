import { isValidObjectId } from "mongoose";
import { handleError } from "../helpers/error-handle.js";
import { successRes } from "../helpers/success-response.js";
import Transport from "../models/transport.model.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import { createTransportValidator,updateTransportValidator } from "../validation/transport.validation.js";


export class TransportController{

    async createTransport(req,res){
        const {value,error} = createTransportValidator(req.body)
        if(error){
            return handleError(res,error,422)

        }
        const existsSeat = await Transport.findOne({seat:value.seat})
        if (existsSeat){
                return handleError(res, 'Seat is already exists', 409);
            
        }
        const transport  = await Transport.create({
            transport_type: value.transport_type,
            class: value.class,
            seat: value.seat});
        
        return successRes(res,transport,201);

        
    };
    async getAllTransport(_,res){
        try {
            const transports = await Transport.find()
            return successRes(res,transports)
        } catch (error) {
            return handleError(res,error)
        }
    };
    async getTransportById(req, res) {
        try {

            const transport = await TransportController.findTransportById(res, req.params.id);
            return successRes(res, transport);
        } catch (error) {
            return handleError(res, error);
        }
    };

    

    async updateTransport(req, res) {
            try {
                const id = req.params.id;
                const { value, error } = updateTransportValidator(req.body);
                if (error) {
                    return handleError(res, error, 422);
                }
                
                const updatedTransport = await Transport.findByIdAndUpdate(id, {
                    ...value
                }, { new: true });

                return successRes(res, updatedTransport);
            } catch (error) {
                return handleError(res, error);
            }
        };
    
    async deleteTransport(req,res){
        try {
            const id = req.params.id
            await TransportController.findTransportById(res,id)
            await Transport.findByIdAndDelete(id)
            return successRes(res,"Transport is deleted successfully")
        } catch (error) {
            return handleError(res,error)
        }
    }

     static async findTransportById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, 'Invalid object ID', 400);
            }
            const tranport = await Transport.findById(id);
            if (!tranport) {
                return handleError(res, 'Transport not found', 404);
            }
            return tranport;
        } catch (error) {
            return handleError(res, error);
        }
    }
    



}