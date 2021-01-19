const mongoose = require('mongoose');
const Schema = mongoose.Schema

let appointmentSchema = new Schema({
	companyName: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	appointmentDate: {
		type: Date,
		require: true
	},
	appointmentMessage: {
		type: String,
		require: true
	},
	status: {
		type: String,
		require: true
	},
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	created_dt: {
		type: Date,
		default: Date.now(),
	}
});


const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;