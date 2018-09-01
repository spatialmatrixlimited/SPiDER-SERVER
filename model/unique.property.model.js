var mongoose = require('mongoose');
var UniquePropertySchema = mongoose.Schema;
var uniquePropertySchema = new UniquePropertySchema({
	property: {
		property_id: String,
		street_id: String,
		building_serial_number: String,
		building_part_occupied: String,
		ownership_type: String,
		house_number: String,
		street_name: String,
		lga: String,
		state: String,
		country: String,
		storey_building: Boolean,
		storey_building_floors: Number,
		refuse_disposal:String,
		has_signage: Boolean,
		gate_house_id: String,
		generator_house_id: String,
		number_of_entity: Number,
		accessible: Boolean,
		site_condition: String,
		water_supply: [String],
		building_type: [String],
		site_conditions: [String],
		master_serial_number: String
	},
	created: Date,
	location: {
		type: {type: String},
		coordinates: {
			latitude: Number,
			longitude: Number
		},
		whatthreewords: String
	},
	enumerator: {
		id: String,
		firstname: String,
		lastname: String,
		email: String
	},
	contact: {
		contact_person: String,
		email: String,
		telephone: String
	},
	property_photos: [{
		url: String,
		snapshot_position: String
	}],
	entities: Number,
	document_status: { type: Number, default: 1}

});

module.exports = mongoose.model('UniqueProperty', uniquePropertySchema, 'weekend_unique_properties');