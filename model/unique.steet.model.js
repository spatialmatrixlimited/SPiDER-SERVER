var mongoose = require('mongoose');
var UniqueStreetSchema = mongoose.Schema;

var uniqueStreetSchema = new UniqueStreetSchema(
    {
        street_photos: [{
            url: String,
            snapshot_position: String
        }],
        street: {
            street_id: String,
            gis_id: String,
            street_name: String,
            road_type: String,
            road_condition: String,
            road_carriage: String,
            refuse_disposal: String,
            drainage: String,
            electricity: String,
            area: String,
            location: String,
            lga: String,
            state: String,
            country: String,
            road_feature: [String],
            street_furniture: [String]
        },
        created: Date,
        properties: Number,
        location: {
            type: { type: String },
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
            email: String,
            mobile: String
        },
        document_status: { type: Number, default: 1},
    }
);

module.exports = mongoose.model('UniqueStreet', uniqueStreetSchema, 'weekend_unique_streets');