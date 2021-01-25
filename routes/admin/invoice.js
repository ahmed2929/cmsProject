const express = require("express");
const router = express.Router();
const invoiceController = require("../../controller/admin/invoice");
const auth = require("../../middleware/auth");


router.get(
    "/",
    auth.authorization("superadmin"),
   invoiceController.getCreatedInvoice
);

router.post(
    "/",
    auth.authorization("superadmin"),
   invoiceController.createInvoice
);


module.exports = router;