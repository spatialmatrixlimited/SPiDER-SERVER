var mongoose = require('mongoose');
var ParsedUserSchema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var parsedUserSchema = new ParsedUserSchema({

    id: {
        type: ObjectId,
        ref: 'User'
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        lowercase: true,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    role: String
});

module.exports = mongoose.model('ParsedUser', parsedUserSchema, 'spider_users');