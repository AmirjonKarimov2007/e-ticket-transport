import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js";

import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";


const router = Router();
const controller = new CustomerController();

router
    .post('/signup', controller.SignUp)
    .post('/signin', controller.SignIn)
    .post('/confirm-signin', controller.confirmSignIn)
    .post('/token', controller.newAccessToken)
    .post('/logout', AuthGuard, controller.logOut)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllCustomers)
    .get('/:id', AuthGuard, SelfGuard, controller.getCustomerByid)
    .patch('/:id', AuthGuard, SelfGuard, controller.updateCustomer)
    .delete('/:id', AuthGuard, RolesGuard(['superadmin']), controller.deleteCustomer)

export default router;