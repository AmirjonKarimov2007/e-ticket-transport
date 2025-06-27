import { Router } from "express";
import { TransportController } from '../controllers/transport.controller.js';
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const router = Router();
const controller = new TransportController();

router
    .post('/', AuthGuard, RolesGuard(['superadmin']), controller.createTransport)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllTransport)
    .get('/:id', AuthGuard, SelfGuard, controller.getTransportById)
    .patch('/:id', AuthGuard, SelfGuard, controller.updateTransport)
    .delete('/:id', AuthGuard, RolesGuard(['superadmin']), controller.deleteTransport)

export default router;