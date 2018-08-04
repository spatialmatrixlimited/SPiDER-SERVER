//Database Model
let StreetRecord = require('../model/street.model');
let PropertyRecord = require('../model/property.model');
let EntityRecord = require('../model/entity.model');

let ParsedStreet = require('../model/parsed.street.model');
let ParsedProperty = require('../model/parsed.property.model');
let ParsedEntity = require('../model/parsed.entity.model');

let processStreet = () => {
    console.log('Parser Engine Started - Street');
    StreetRecord.find({
        $or: [{
            'parsed': {
                '$exists': false
            }
        }, {
            'parsed': {
                '$exists': true,
                '$eq': false
            }
        }]
    }, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} STREET Records to Process`);
                let index = 0;
                let newRecord;
                let photos;

                doc.forEach(_doc => {
                    index += 1;
                    photos = [];
                    _doc.street_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }));

                    newRecord = new ParsedStreet({
                        'street': _doc.street,
                        'street_photos': photos,
                        'created': _doc.created,
                        'properties': _doc.properties,
                        'location.type': _doc.location.type,
                        'location.coordinates.longitude': _doc.location.coordinates[0],
                        'location.coordinates.latitude': _doc.location.coordinates[1],
                        'location.whatthreewords': _doc.location.whatthreewords,
                        'enumerator': _doc.enumerator,
                        'document_status': _doc.document_status
                    });

                    newRecord.save().then((_streetData) => {
                        if (_streetData) {
                            StreetRecord.findOneAndUpdate({
                                '_id': _doc._id
                            }, {
                                'parsed': true
                            }, {
                                new: true
                            }, (err, newData) => {
                                if (err || !newData) {
                                    console.log('An error occurred while updating record with parsed = true');
                                } else {
                                    index += 1;
                                    console.log(`Street Record ${index} processed`);
                                }
                            });
                        } else {
                            console.log(`Street Record NOT processed`);
                        }
                    }).catch((err) => {
                        console.error(err);
                    });

                });

            } else {
                console.log("No street data to process");
            }
        }
    });
}

let processProperty = () => {
    console.log('Parser Engine Started - Property');
    PropertyRecord.find({
        $or: [{
            'parsed': {
                '$exists': false
            }
        }, {
            'parsed': {
                '$exists': true,
                '$eq': false
            }
        }]
    }, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} PROPERTY Records to Process`);
                let index = 0;
                let newRecord;
                let photos;

                doc.forEach(_doc=>{
                    photos = [];
                    _doc.property_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }))

                    newRecord = new ParsedProperty({
                        'property': _doc.property,
                        'property_photos': photos,
                        'created': _doc.created,
                        'entities': _doc.entities,
                        'location.type': _doc.location.type,
                        'location.coordinates.longitude': _doc.location.coordinates[0],
                        'location.coordinates.latitude': _doc.location.coordinates[1],
                        'location.whatthreewords': _doc.location.whatthreewords,
                        'enumerator': _doc.enumerator,
                        'contact': _doc.contact,
                        'document_status': _doc.document_status
                    });

                    newRecord.save().then((_propertyData) => {
                        if (_propertyData) {
                            PropertyRecord.findOneAndUpdate({
                                '_id': _doc._id
                            }, {
                                'parsed': true
                            }, {
                                new: true
                            }, (err, newData) => {
                                if (err || !newData) {
                                    console.log('An error occurred while updating record with parsed = true');
                                } else {
                                    index += 1;
                                    console.log(`PROPERTY Record ${index} processed`);
                                }
                            });
                        } else {
                            console.log(`PROPERTY Record NOT processed`);
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                });

            } else {
                console.log("No property data to process");
            }
        }
    });
}

let processEntity = () => {
    console.log('Parser Engine Started -  Entity');
    EntityRecord.find({}, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} ENTITY Records to Process`);
                let index = 0;
                let newRecord;
                let photos;

                doc.forEach((_doc) => {
                    photos = [];
                    _doc.property_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position,
                        title: photo.title,
                        location: {
                            type: photo.location.type,
                            coordinates: {
                                longitude: photo.location.coordinates[0],
                                latitude: photo.location.coordinates[1]
                            }
                        }
                    }))

                    newRecord = new ParsedEntity({
                        'property_id': _doc.property_id,
                        'entity': _doc.entity,
                        'property_photos': photos,
                        'created': _doc.created,
                        'modified': _doc.modified,
                        'modified_by': _doc.modified_by,
                        'entities': _doc.entities,
                        'location.type': _doc.location.type,
                        'location.coordinates.longitude': _doc.location.coordinates[0],
                        'location.coordinates.latitude': _doc.location.coordinates[1],
                        'location.whatthreewords': _doc.location.whatthreewords,
                        'enumerator': _doc.enumerator,
                        'contact': _doc.contact,
                        'document_owner': _doc.document_owner,
                        'document_status': _doc.document_status
                    });

                    newRecord.save().then((_propertyData) => {
                        if (_propertyData) {
                            EntityRecord.findOneAndUpdate({
                                '_id': _doc._id
                            }, {
                                'parsed': true
                            }, {
                                new: true
                            }, (err, newData) => {
                                if (err || !newData) {
                                    console.log('An error occurred while updating record with parsed = true');
                                } else {
                                    index += 1;
                                    console.log(`ENTITY Record ${index} processed`);
                                }
                            });
                        } else {
                            console.log(`ENTITY records NOT processed`);
                        }

                    }).catch((err) => {
                        console.error(err);
                    });
                });

            } else {
                console.log("No entity data to process");
            }
        }
    });
}

let processUpdateEntity = () => {
    console.log('Parser Engine Started -  Entity (Update)');
    EntityRecord.find({}, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} Entity Records Update to Process`);
                let index = 0;
                doc.forEach((_doc) => {
                    ParsedEntity.findOneAndUpdate({
                        'entity.entity_id': _doc.entity.entity_id
                    }, {
                        'property_id': _doc.property_id
                    }, {
                        new: true
                    }, (err, __doc) => {
                        if (err || !__doc) {
                            console.log('Unable to update Entity Record');
                        } else {
                            index += 1;
                            console.log('Updated Entity Record ' + index);
                        }
                    });

                });
            } else {
                console.log("No entity data to process");
            }
        }
    });
}

exports.processStreet = processStreet;
exports.processProperty = processProperty;
exports.processEntity = processEntity;
exports.processUpdateEntity = processUpdateEntity;