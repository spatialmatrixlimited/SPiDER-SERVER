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
                let totalRecords = doc.length;
                let total = doc.length;
                let index = 0;
                let newRecord;
                let photos;
                let streetTimer = setInterval(()=>{
                    photos = [];
                    doc[index]['street_photos'].forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }))

                    newRecord = new ParsedStreet({
                        'street': doc[index].street,
                        'street_photos': photos,
                        'created': doc[index].created,
                        'properties': doc[index].properties,
                        'location.type': doc[index].location.type,
                        'location.coordinates.longitude': doc[index].location.coordinates[0],
                        'location.coordinates.latitude': doc[index].location.coordinates[1],
                        'location.whatthreewords': doc[index].location.whatthreewords,
                        'enumerator': doc[index].enumerator,
                        'document_status': doc[index].document_status
                    });

                    newRecord.save().then((_streetData) => {
                        if (_streetData) {
                            console.log(index);
                            console.log(doc);
                            StreetRecord.findOneAndUpdate({
                                '_id': doc[index]['_id']
                            }, {
                                'parsed': true
                            }, {
                                new: true
                            }, (err, newData) => {
                                if (err || !newData) {
                                    console.log('An error occurred while updating record with parsed = true');
                                } else {
                                    console.log(`Street Record ${index+1} processed`);
                                }
                            });
                        } else {
                            console.log(`Street Record NOT processed`);
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                    index += 1;
                    console.log('Street Round ' + index);
                    totalRecords -= 1;
                    if (totalRecords < 1) {
                        console.log(`${index} out of ${total} STREET records processed`);
                        clearInterval(streetTimer);
                    }
                },2000);

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
                let totalRecords = doc.length;
                let total = doc.length;
                let index = 0;
                let newRecord;
                let photos;

                let propertyTimer = setInterval(()=>{
                    photos = [];
                    doc[index]['property_photos'].forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }))

                    newRecord = new ParsedProperty({
                        'property': doc[index].property,
                        'property_photos': photos,
                        'created': doc[index].created,
                        'entities': doc[index].entities,
                        'location.type': doc[index].location.type,
                        'location.coordinates.longitude': doc[index].location.coordinates[0],
                        'location.coordinates.latitude': doc[index].location.coordinates[1],
                        'location.whatthreewords': doc[index].location.whatthreewords,
                        'enumerator': doc[index].enumerator,
                        'contact': doc[index].contact,
                        'document_status': doc[index].document_status
                    });

                    newRecord.save().then((_propertyData) => {
                        if (_propertyData) {
                            PropertyRecord.findOneAndUpdate({
                                '_id': doc[index]['_id']
                            }, {
                                'parsed': true
                            }, {
                                new: true
                            }, (err, newData) => {
                                if (err || !newData) {
                                    console.log('An error occurred while updating record with parsed = true');
                                } else {
                                    console.log(`PROPERTY Record ${index+1} processed`);
                                }
                            });
                        } else {
                            console.log(`PROPERTY Record NOT processed`);
                        }

                    }).catch((err) => {
                        console.error(err);
                    });

                    index += 1;
                    console.log('Property Round ' + index);
                    totalRecords -= 1;
                    if (totalRecords < 1) {
                        console.log(`${index} out of ${total} records processed`);
                        clearInterval(propertyTimer);
                    }
                },2000);

            } else {
                console.log("No property data to process");
            }
        }
    });
}

let processEntity = () => {
    console.log('Parser Engine Started -  Entity');
    EntityRecord.find({
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
                console.log(`${doc.length} ENTITY Records to Process`);
                let totalRecords = doc.length;
                let total = doc.length;
                let index = 0;
                let newRecord;
                let photos;

                let entityTimer = setInterval(()=>{
                    photos = [];
                    doc[index]['property_photos'].forEach(photo => photos.push({
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
                        'property_id': doc[index].property_id,
                        'entity': doc[index].entity,
                        'property_photos': photos,
                        'created': doc[index].created,
                        'modified': doc[index].modified,
                        'modified_by': doc[index].modified_by,
                        'entities': doc[index].entities,
                        'location.type': doc[index].location.type,
                        'location.coordinates.longitude': doc[index].location.coordinates[0],
                        'location.coordinates.latitude': doc[index].location.coordinates[1],
                        'location.whatthreewords': doc[index].location.whatthreewords,
                        'enumerator': doc[index].enumerator,
                        'contact': doc[index].contact,
                        'document_owner': doc[index].document_owner,
                        'document_status': doc[index].document_status
                    });

                    newRecord.save().then((_propertyData)=> {
                        if (_propertyData) {
                            EntityRecord.findOneAndUpdate({
                                '_id': doc[index]['_id']
                            }, {
                                'parsed': true
                            }, {
                                new: true
                            }, (err, newData) => {
                                if (err || !newData) {
                                    console.log('An error occurred while updating record with parsed = true');
                                } else {
                                    console.log(`${index+1} out of ${total} ENTITY records processed`);
                                }
                            });
                        } else {
                            console.log(`ENTITY records NOT processed`);
                        }

                    }).catch((err) => {
                        console.error(err);
                    });

                    index += 1;
                    console.log('Entity Round ' + index);
                    totalRecords -= 1;
                    if (totalRecords < 1) {
                        console.log(`${index} out of ${total} records processed`);
                        clearInterval(entityTimer);
                    }
                },2000);

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
                let totalRecords = doc.length;
                let total = doc.length;
                let index = 0;
                let entityUpdateTimer = setInterval(()=>{

                    ParsedEntity.findOneAndUpdate({
                        'entity.entity_id': doc[index].entity.entity_id
                    }, {
                        'property_id': doc[index].property_id
                    }, {
                        new: true
                    }, (err, _doc) => {
                        if (err || !_doc) {
                            console.log('Unable to update Entity Record');
                        } else {
                            console.log(`Entity Record ${index+1} processed`);
                            console.log('Updated Entity Record ' + index + 1);
                        }
                    });

                    index += 1;
                    totalRecords -= 1;
                    if (totalRecords < 1) {
                        console.log(`${index} out of ${total} records processed`);
                        clearInterval(entityUpdateTimer);
                    }

                },3000);
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