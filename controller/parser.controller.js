var Street = require('../model/unique.street.model');
var Property = require('../model/unique.property.model');
var Entity = require('../model/unique.entity.model');

var JulyStreet = require('../model/july.street.model');
var AugustStreet = require('../model/august.street.model');
var SeptemberStreet = require('../model/september.street.model');

var JulyProperty = require('../model/july.property.model');
var AugustProperty = require('../model/august.property.model');
var SeptemberProperty = require('../model/september.property.model');

var JulyEntity = require('../model/july.entity.model');
var AugustEntity = require('../model/august.entity.model');
var SeptemberEntity = require('../model/september.entity.model');

var parserController = {
    july: () => {
        Street.find({
            created: {
                $gte: ISODate("2018-07-07T00:00:00.000Z"),
                $lt: ISODate("2018-07-31T00:00:00.000Z")
            }
        }, (err, docs) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`July: Streets Captured is ${docs.length}`);
                JulyStreet.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });

       

        Property.find({
            created: {
                $gte: ISODate("2018-07-07T00:00:00.000Z"),
                $lt: ISODate("2018-07-31T00:00:00.000Z")
            }
        }, (err, docs) => {
            console.log('-----------------------------------------------');
            if (err) {
                console.error(err);
            } else {
                console.log(`July: Properties Captured is ${docs.length}`);
                JulyProperty.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });

        

        Entity.find({
            created: {
                $gte: ISODate("2018-07-07T00:00:00.000Z"),
                $lt: ISODate("2018-07-31T00:00:00.000Z")
            }
        }, (err, docs) => {
            console.log('-----------------------------------------------');
            if (err) {
                console.error(err);
            } else {
                console.log(`July: Entities Captured is ${docs.length}`);
                JulyEntity.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });


    },

    august: () => {
        Street.find({
            created: {
                $gte: ISODate("2018-08-01T00:00:00.000Z"),
                $lt: ISODate("2018-08-31T00:00:00.000Z")
            }
        }, (err, docs) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`August: Streets Captured is ${docs.length}`);
                AugustStreet.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });



        Property.find({
            created: {
                $gte: ISODate("2018-08-01T00:00:00.000Z"),
                $lt: ISODate("2018-08-31T00:00:00.000Z")
            }
        }, (err, docs) => {
            console.log('-----------------------------------------------');
            if (err) {
                console.error(err);
            } else {
                console.log(`August: Properties Captured is ${docs.length}`);
                AugustProperty.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });



        Entity.find({
            created: {
                $gte: ISODate("2018-08-01T00:00:00.000Z"),
                $lt: ISODate("2018-08-31T00:00:00.000Z")
            }
        }, (err, docs) => {
            if (err) {
                console.error(err);
            } else {
                console.log('-----------------------------------------------');
                console.log(`August: Entities Captured is ${docs.length}`);
                AugustEntity.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });
    },

    september: () => {
        Street.find({
            created: {
                $gte: ISODate("2018-09-01T00:00:00.000Z"),
                $lt: ISODate("2018-09-30T00:00:00.000Z")
            }
        }, (err, docs) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`September: Streets Captured is ${docs.length}`);
                SeptemberStreet.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });


        Property.find({
            created: {
                $gte: ISODate("2018-09-01T00:00:00.000Z"),
                $lt: ISODate("2018-09-30T00:00:00.000Z")
            }
        }, (err, docs) => {
            console.log('-----------------------------------------------');
            if (err) {
                console.error(err);
            } else {
                console.log(`September: Properties Captured is ${docs.length}`);
                SeptemberProperty.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });


        Entity.find({
            created: {
                $gte: ISODate("2018-09-01T00:00:00.000Z"),
                $lt: ISODate("2018-09-30T00:00:00.000Z")
            }
        }, (err, docs) => {
            console.log('-----------------------------------------------');
            if (err) {
                console.error(err);
            } else {
                console.log(`September: Entities Captured is ${docs.length}`);
                SeptemberEntity.insertMany(docs).then(result => {
                    console.log(result);
                });
            }
        });
    }
}

module.exports = parserController;