const express = require("express");
const router = express.Router();
const appointmentController = require("../../controller/admin/appointment");
const auth = require("../../middleware/auth");


router.post(
    "/:appointment_id",
    auth.authorization("superadmin","admin"),
    appointmentController.confirmAppointment
);

router.post(
    "/reject/:appointment_id",
    auth.authorization("superadmin","admin"),
    appointmentController.rejectAppointment
);

router.get(
    "/",
    auth.authorization("superadmin","admin"),
    appointmentController.getAppointments
);





module.exports = router;