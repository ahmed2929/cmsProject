const express = require("express");
const router = express.Router();
const appointmentController = require("../../controller/user/appointment");
const validation = require("../../middleware/validation");
const auth = require("../../middleware/auth");


router.post(
    "/",
    auth.authorization("user"),
    appointmentController.createAppointment
);

router.get(
    "/",
    auth.authorization("user"),
    appointmentController.getBookedAppointemnt
);


module.exports = router;