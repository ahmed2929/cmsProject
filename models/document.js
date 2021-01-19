const mongoose = require('mongoose');
const Schema = mongoose.Schema

let documentSchema = new Schema({
	receiver: {
		type: String,
		require: true
	},
	sender: {
		type: String,
		require: true
	},
	docName: {
		type: String,
		require: true
	},
	docContentUrl: {
		type: String
	},
	created_dt: {
		type: Date,
		default: Date.now(),
	}

})

module.exports = mongoose.model('document', documentSchema)