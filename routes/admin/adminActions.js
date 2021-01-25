const express = require("express");
const router = express.Router();
const adminActionsController = require("../../controller/admin/adminActions");
const validation = require("../../middleware/validation");
const auth = require("../../middleware/auth");
const multer = require("multer");
const path = require('path');
const userController=require("../../controller/user/index")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({ storage: storage });


router.get(
    "/users",
    auth.authorization("superadmin"),
    adminActionsController.getAllUsers
);

router.get(
  "/user",
  auth.authorization("admin"),
  adminActionsController.getUsers
);



router.patch(
    "/date/:user_id",
    auth.authorization("superadmin"),
    adminActionsController.setSubDate
);

router.post(
    "/add/:user_id/:admin_id",
    auth.authorization("superadmin"),
    adminActionsController.assignUserToAdmin
);

router.post(
  "/assignUsersToAdmin/:admin_id",
  auth.authorization("superadmin"),
  adminActionsController.assignUsersToAdmin
);

router.post(
    "/bulkuser",
    auth.authorization("superadmin"),
    upload.single("BulkExcel"),
    adminActionsController.bulkUser
);


router.post(
  "/createNewUser",
  auth.authorization("superadmin","admin"),
  validation.signUpValidationRules(),
  validation.validate,
  userController.signUp

  
);

router.post(
  "/editUserInfo",
  auth.authorization("superadmin","admin"),
  validation.updateUserInfo(),
  validation.validate,
  adminActionsController.updateUserInfo

  
);

router.post(
  "/deleteUser",
  auth.authorization("superadmin","admin"),
  validation.updateUserInfo(),
  validation.validate,
  adminActionsController.deletUser

  
);


module.exports = router;