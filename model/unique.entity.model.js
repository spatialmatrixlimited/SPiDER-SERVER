var mongoose = require('mongoose');
var UniqueEntitySchema = mongoose.Schema;

var uniqueEntitySchema = new UniqueEntitySchema({
	property_id: String,
	entity: {
		boys_quarter: Number,
		meter_number: String,
		entity_group: String,
		entity_name: String,
		meter_available: Boolean,
		meter_condition: String,
		meter_phases: String,
		entity_id: String,
		entity_category: String,
		meter_type: String,
		has_signage: Boolean
	},
	location: {
		whatthreewords: String,
		coordinates: {
			latitude: Number,
			longitude: Number
		},
		type: {type: String}
	},
	document_owner: String,
	enumerator: {
		firstname: String,
		lastname: String,
		mobile: String,
		id: String,
		email: String
	},
	contact: {
		contact_person: String,
		telephone: String,
		email: String
	},
	property_photos: [{
		url: String,
		location: {
			whatthreewords: String,
			coordinates: {
				latitude: Number,
				longitude: Number
			},
			type: { type: String }
		},
		title: String,
		snapshot_position: String
	}],
	document_status: { type: Number, default: 1},
	created: Date,
	modified: Date
});


module.exports = mongoose.model('UniqueEntity', uniqueEntitySchema, 'unique_entities_thursday');