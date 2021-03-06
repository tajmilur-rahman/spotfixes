const express = require('express');
const router = express.Router();
const { canActivate } = require('./middleware/auth-guard.middleware');
const LoginComponent = require('./component/public/login.component');
const SignupComponent = require('./component/public/signup.component');
const UserComponent = require('./component/private/user.component');
const CustomerComponent = require('./component/private/customer.component');
const StatusComponent = require('./component/private/status.component');
const OrderComponent = require('./component/private/order.component');

router.post('/auth/login', LoginComponent.authenticate);
router.post('/auth/signup', SignupComponent.createUser);
router.put('/auth/reset-password/:id', SignupComponent.resetPassword);
router.post('/auth/forget-password', SignupComponent.forgetPassword);
router.get('/users', canActivate(), UserComponent.getAll);
router.get('/orders', canActivate(), OrderComponent.getAll);
router.post('/orders', canActivate(), OrderComponent.create);
router.post('/orders/change-status', canActivate(), OrderComponent.changeStatus);
router.get('/orders/request', canActivate(), OrderComponent.requestOrderList);
router.post('/orders/request', canActivate(), OrderComponent.createRequestOrder);
router.post('/orders/assign-tech', canActivate(), OrderComponent.assignTech);
router.get('/customers', canActivate(), CustomerComponent.getAll);
router.get('/statuses', canActivate(), StatusComponent.getAll);
router.get('/country-timezones', canActivate(), OrderComponent.getCountryTimezone);

module.exports = router;