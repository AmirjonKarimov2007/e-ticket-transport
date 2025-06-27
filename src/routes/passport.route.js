import {PassportController} from "../controllers/passport.controller.js"
import { Router } from "express";

import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";




const controller = new PassportController();
const router = Router();

router
    .post('/',controller.createPassportInfo)
    .get('/',AuthGuard,RolesGuard(['superadmin']),controller.getAllPassportInfo)
    .get('/:id',AuthGuard, SelfGuard,controller.getPassportById)
    .patch('/:id',AuthGuard, SelfGuard,controller.updatePassportInfo)
    .delete('/:id',RolesGuard(['superadmin']),controller.deletePassportInfo)


export default router;