const mongoose = require('mongoose');
const Schema = mongoose.Schema

let clientInvoiceSchema = new Schema({
	dateIssued: {
		type: Date,
		require: true
	},
	dateDue: {
		type: Date,
		require: true
	},
	serviceRendered: {
		type: String,
		require: true
	},
	fullName: {
		type: String,
		require: true
	},
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	invoiceNumber: {
		type: String,
		require: true
	},
	title: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	qty: {
		type: Number,
		require: true
	},
	price: {
		type: Number,
		require: true
	},
	created_dt: {
		type: String,
		default: Date.now()
	}
});


const Invoice = mongoose.model("Invoice", clientInvoiceSchema);

module.exports = Invoice;