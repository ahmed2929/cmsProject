const express = require("express");
const router = express.Router();
const userController = require("../../controller/user/index");
const validation = require("../../middleware/validation");
const auth = require("../../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
    "/signup",
    validation.signUpValidationRules(),
    validation.validate,
    userController.signUp
);

router.post(
    "/login",
    validation.loginValidationRules(),
    validation.validate,
    userController.logIn
);

router.post(
    "/forgetpassword",
    userController.forgetPassword
);

router.post(
    "/resetforgetpassword",
    userController.resetForgetPassword
);

router.post(
    "/resetpassword",
    auth.authorization("user"),
    userController.resetPassword
);

router.get(
    "/",
    auth.authorization("user"),
    userController.getUserData
);

router.patch(
    "/image",
    auth.authorization("user"),
    upload.single("profilePics"),
    userController.uploadPicture
);

router.patch(
    "/",
    auth.authorization("user"),
    userController.updateUserData
);



module.exports = router;