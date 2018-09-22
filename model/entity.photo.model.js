var mongoose = require('mongoose');
var EntityPhotoSchema = mongoose.Schema;

var entityPhotoSchema = new EntityPhotoSchema({
    entity: {
        entity_id : {
            type: String,
            index: true
        },
        property_id: {
            type: String,
            index: true
        }
    },
    property_photos: [{
        snapshot_position: String,
        url: String
    }],
    created: {
        type: Date
    }
});

module.exports = mongoose.model('EntityPhoto', entityPhotoSchema, 'spider_entity_photos');