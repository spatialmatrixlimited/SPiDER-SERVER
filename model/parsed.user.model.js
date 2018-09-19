var mongoose = require('mongoose');
var ParsedUserSchema = mongoose.Schema;
var parsedUserSchema = new ParsedUserSchema({

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

module.exports = mongoose.model('ParsedUser', parsedUserSchema, 'parsed_users');