const Invoice = require("../../models/clientInvoice");
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");




// Create Invoice
exports.createInvoice = async (req, res) => {
    try {

        // create new invoice
        const newInvoice = await Invoice.create(req.body);
        return successResMsg(res, 201, newInvoice);

    } catch (err) {
        // return error response
        return errorResMsg(res, 500, err);
    }
};

// Get  created rquest
exports.getCreatedInvoice = async (req, res) => {
    try {

        // get created Invoice
        const createdInvoice = await Invoice.find({});

        return successResMsg(res, 200, createdInvoice);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}