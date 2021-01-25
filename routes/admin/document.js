const express = require("express");
const router = express.Router();
const adminDocController = require("../../controller/admin/document");
const validation = require("../../middleware/validation");
const auth = require("../../middleware/auth");
const multer = require("multer");
const path = require('path');


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
    "/:user_id",
    auth.authorization("superadmin","admin"),
    upload.single("docContentUrl"),
    adminDocController.uploadDocToUser
);

router.get(
    "/",
    auth.authorization("superadmin","admin"),
    adminDocController.getAdminDoc
);

router.get(
    "/user",
    auth.authorization("superadmin","admin"),
    adminDocController.getUserIncomingDoc
);




module.exports = router;