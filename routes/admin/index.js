const express = require("express");
const router = express.Router();
const adminController = require("../../controller/admin/index");
const validation = require("../../middleware/validation");
const auth = require("../../middleware/auth");


router.post(
    "/signup",
   auth.authorization("superadmin"),
    validation.adminSignUpValidationRules(),
    validation.validate,
    adminController.adminSignUp
);

router.post(
    "/login",
    validation.loginValidationRules(),
    validation.validate,
    adminController.adminlogIn
);

router.post(
    "/forgetpassword",
    adminController.adminForgetPassword
);

router.post(
    "/resetforgetpassword",
    adminController.adminResetForgetPassword
);

router.post(
    "/resetpassword",
    auth.authorization("admin", "superadmin"),
    adminController.adminResetPassword
);

router.get(
    "/",
    auth.authorization("admin", "superadmin"),
    adminController.getAdminData
);

router.get(
    "/allAdmins",
    auth.authorization("admin", "superadmin"),
    adminController.getAllAdmins
);

router.get(
    "/user/:userId",
    auth.authorization("admin", "superadmin"),
    adminController.getUserData
);

router.get(
    "/user/:userId",
    auth.authorization("superadmin"),
    adminController.updateUserData
);

module.exports = router;