var mongoose = require('mongoose');
var StreetPhotoSchema = mongoose.Schema;

var streetPhotoSchema = new StreetPhotoSchema({
    street: {
        street_id: {
            type: String,
            index: true
        },
    },
    street_photos: [{
        snapshot_position: String,
        url: String
    }],
    created: {
        type: Date
    }
});

module.exports = mongoose.model('StreetPhoto', streetPhotoSchema, 'street_photos');