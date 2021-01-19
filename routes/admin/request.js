const express = require("express");
const router = express.Router();
const requestController = require("../../controller/admin/request");
const auth = require("../../middleware/auth");


router.get(
    "/",
    auth.authorization("superadmin","admin"),
    requestController.getRequest
);

router.get(
    "/usersRequests",
    auth.authorization("admin"),
    requestController.getUsersRequests
);


module.exports = router;