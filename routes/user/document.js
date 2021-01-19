const express = require("express");
const router = express.Router();
const userActionsController = require("../../controller/user/document");
const validation = require("../../middleware/validation");
const auth = require("../../middleware/auth");
const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
const upload = multer({ storage: storage });


router.post(
    "/:admin_id",
    auth.authorization("user"),
    upload.single("docContentUrl"),
    userActionsController.uploadDocToAdmin
);

router.get(
    "/",
    auth.authorization("user"),
    userActionsController.getClientDoc
);

router.get(
    "/admin",
    auth.authorization("user"),
    userActionsController.getAdminIncomingDoc
);


module.exports = router;