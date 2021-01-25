const mongoose = require('mongoose');
const Schema = mongoose.Schema

let requestSchema = new Schema({
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	accountOfficer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin"
	  },
	requestTitle: {
		type: String,
		require: true
	},
	requestDescription: {
		type: String,
		require: true
	},
	attachedFileName: {
		type: String
	},
	attachedFileUrl: {
		type: String
	},
	created_dt: {
		type: Date,
		default:Date.now()
	}

})

module.exports = mongoose.model('request', requestSchema)