const express = require("express");
const router = express.Router();
const requestController = require("../../controller/user/request");
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
    "/",
    auth.authorization("user"),
    upload.single("attachedFileUrl"),
    requestController.createRequest
);

router.get(
    "/",
    auth.authorization("user"),
    requestController.getCreatedRequest
);



module.exports = router;