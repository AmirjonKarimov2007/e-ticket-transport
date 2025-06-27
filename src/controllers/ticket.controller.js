import { isValidObjectId } from "mongoose";
import { handleError } from "../helpers/error-handle.js";
import { successRes } from "../helpers/success-response.js";
import Ticket from "../models/ticket.model.js";
import { CreateTicketValidator, UpdateTicketValidator } from "../validation/ticket.validation.js";

export class TicketController {
    async createTicket(req, res) {
        try {
            const { value, error } = CreateTicketValidator(req.body);
            if (error) {
                return handleError(res, error, 422)
            };
            const ticket = await Ticket.create({
                transport_id: value.transport_id,
                from: value.from,
                to: value.to,
                price: value.price,
                departure: value.departure,
                arrival: value.arrival,
                customer_id: value.customer_id
            })
            return successRes(res, ticket)

        } catch (error) {
            return handleError(res, error)
        }
    };
    async getAllTicket(req, res) {
        try {
            const tickets = await Ticket.find()
            return successRes(res, tickets)
        } catch (error) {
            return handleError(res, error)
        }
    };
    async getTicketById(req, res) {
        try {
            const id = req.params.id
            const ticket = await TicketController.findTicketByid(res, id)
            return successRes(res, ticket);
        } catch (error) {
            return handleError(res, error)
        }
    };
    async updateTicket(req, res) {
        try {
            const id = req.params.id
            const { value, error } = UpdateTicketValidator(req.body)
            if (error) {
                return handleError(res, error, 422)
            }
            const updatedTicket = await Ticket.findByIdAndUpdate(id, {
                ...value
            }, { new: true });
            return successRes(res, updatedTicket);

        } catch (error) {

            return handleError(res, error)
        };
    };

    async deleteTicket(req, res) {
        try {

            const id = req.params.id
            const ticket = await TicketController.findTicketByid(res,id)
            await Ticket.findByIdAndDelete(id)
            return successRes(res,"Ticket is deleted Successfully")

        } catch (error) {
            return handleError(res, error)
        }
    }
    static async findTicketByid(res, id) {
        try {
            if (!isValidObjectId) {
                return handleError(res, 'Invalid Object ID', 400);

            };
            const ticket = await Ticket.findById(id);
            if (!ticket) {
                return handleError(res, 'Ticket not found');
            };
            return ticket;
        } catch (error) {
            return handleError(res, error)
        }
    }
}

