//Database Model
let StreetRecord = require('../model/street.model');
let PropertyRecord = require('../model/property.model');
let EntityRecord = require('../model/entity.model');

let ParsedStreet = require('../model/parsed.street.model');
let ParsedProperty = require('../model/parsed.property.model');
let ParsedEntity = require('../model/parsed.entity.model');

let UniqueStreet = require('../model/unique.steet.model');
let UniqueProperty = require('../model/unique.property.model');
let UniqueEntity = require('../model/unique.entity.model');

let StreetPhoto = require('../model/street.photo.model');
let PropertyPhoto = require('../model/property.photo.model');
let EntityPhoto = require('../model/entity.photo.model');

let fetchUniqueData = (docs, docType) => {
    return new Promise(resolve => {
        let unique = [];
        let seen = [];
        docs.forEach(doc => {
            if (seen.length === 0) {
                unique.push(doc);
                if (docType === 'street') {
                    seen.push(doc.street.street_id);
                }
                if (docType === 'property') {
                    seen.push(doc.property.building_serial_number);
                }
                if (docType === 'entity') {
                    seen.push(doc.entity.entity_id);
                }

            } else {
                if (docType === 'street') {
                    if (seen.indexOf(doc.street.street_id) === -1) {
                        unique.push(doc);
                        seen.push(doc.street.street_id);
                    }
                }
                if (docType === 'property') {
                    if (seen.indexOf(doc.property.building_serial_number) === -1) {
                        unique.push(doc);
                        seen.push(doc.property.building_serial_number);
                    }
                }
                if (docType === 'entity') {
                    if (seen.indexOf(doc.entity.entity_id) === -1) {
                        unique.push(doc);
                        seen.push(doc.entity.entity_id);
                    }
                }

            }
        });
        resolve(unique);
    });
}

let parseRecords = (docs, docType) => {
    return new Promise(resolve => {
        let newRecord = {};
        let newRecords = [];
        let photos;
        let totalRecords = docs.length;
        if (docType === 'street') {
            console.log(`${totalRecords} ${docType} records for processing...`);
            docs.forEach(doc => {
                photos = [];
                doc.street_photos.forEach(photo => photos.push({
                    url: photo.url,
                    snapshot_position: photo.snapshot_position
                }));

                newRecord = {
                    'street': doc.street,
                    'street_photos': photos,
                    'created': doc.created,
                    'properties': doc.properties,
                    'location': {
                        'type': doc.location.type,
                        'coordinates': {
                            'longitude': doc.location.coordinates[0],
                            'latitude': doc.location.coordinates[1]
                        },
                        'whatthreewords': doc.location.whatthreewords
                    },
                    'enumerator': doc.enumerator,
                    'document_status': doc.document_status
                }

                newRecords.push(newRecord);

            });

            resolve(newRecords);
        }

        if (docType === 'property') {
            console.log(`${totalRecords} ${docType} records for processing...`);
            docs.forEach(doc => {

                photos = [];

                doc.property_photos.forEach(photo => photos.push({
                    url: photo.url,
                    snapshot_position: photo.snapshot_position
                }));

                newRecord = {
                    'property': doc.property,
                    'property_photos': photos,
                    'created': doc.created,
                    'entities': doc.entities,
                    'location': {
                        'type': doc.location.type,
                        'coordinates': {
                            'longitude': doc.location.coordinates[0],
                            'latitude': doc.location.coordinates[1]
                        },
                        'whatthreewords': doc.location.whatthreewords
                    },
                    'enumerator': doc.enumerator,
                    'contact': doc.contact,
                    'document_status': doc.document_status
                }

                newRecords.push(newRecord);

            });

            resolve(newRecords);
        }

        if (docType === 'entity') {
            console.log(`${totalRecords} ${docType} records for processing...`);
            docs.forEach(doc => {

                photos = [];

                doc.property_photos.forEach(photo => photos.push({
                    url: photo.url,
                    snapshot_position: photo.snapshot_position
                }));

                newRecord = {
                    'property_id': doc.property_id,
                    'entity': doc.entity,
                    'property_photos': photos,
                    'created': doc.created,
                    'modified': doc.modified,
                    'modified_by': doc.modified_by,
                    'entities': doc.entities,

                    'location': {
                        'type': doc.location.type,
                        'coordinates': {
                            'longitude': doc.location.coordinates[0],
                            'latitude': doc.location.coordinates[1]
                        },
                        'whatthreewords': doc.location.whatthreewords
                    },
                    'enumerator': doc.enumerator,
                    'contact': doc.contact,
                    'document_owner': doc.document_owner,
                    'document_status': doc.document_status
                }

                newRecords.push(newRecord);

            });

            resolve(newRecords);
        }
    });
}

let processStreet = () => {
    console.log('Parser Engine Started - Property');
    StreetRecord.find({}, (err, docs) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (docs.length > 0) {
                console.log(`${docs.length} STREET Records to Process`);
                parseRecords(docs, 'street').then(returned => {
                    if (returned.length > 0) {
                        console.log(`${returned.length} street records for bulk processing...`);
                        ParsedStreet.insertMany(returned, (err, savedDocs) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`${savedDocs.length} street records saved!`);
                            }
                        })
                    } else {
                        console.log('Nothing to process here (Street)');
                    }
                });

            } else {
                console.log("No  property data to process");
            }
        }
    });
}


let processProperty = () => {
    console.log('Parser Engine Started - Street');
    PropertyRecord.find({}, (err, docs) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (docs.length > 0) {
                console.log(`${docs.length} PROPERTY Records to Process`);
                parseRecords(docs, 'property').then(returned => {
                    if (returned.length > 0) {
                        console.log(`${returned.length} property records for bulk processing...`);
                        ParsedProperty.insertMany(returned, (err, savedDocs) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`${savedDocs.length} property records saved!`);
                            }
                        })
                    } else {
                        console.log('Nothing to process here (Property)');
                    }
                });

            } else {
                console.log("No street data to process");
            }
        }
    });
}


let processEntity = () => {
    console.log('Parser Engine Started - Entity');
    PropertyRecord.find({}, (err, docs) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (docs.length > 0) {
                console.log(`${docs.length} ENTITY Records to Process`);
                parseRecords(docs, 'entity').then(returned => {
                    if (returned.length > 0) {
                        console.log(`${returned.length} entity records for bulk processing...`);
                        ParsedEntity.insertMany(returned, (err, savedDocs) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`${savedDocs.length} entity records saved!`);
                            }
                        })
                    } else {
                        console.log('Nothing to process here (Entity)');
                    }
                });

            } else {
                console.log("No entity data to process");
            }
        }
    });
}

let processStreetV1 = () => {
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
                let totalRecords = doc.length;
                let streetTimer = setInterval(() => {
                    index += 1;
                    photos = [];
                    if (doc[index]) {
                        doc[index].street_photos.forEach(photo => photos.push({
                            url: photo.url,
                            snapshot_position: photo.snapshot_position
                        }));

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
                                StreetRecord.findOneAndUpdate({
                                    '_id': doc[index]._id
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
                    }


                    index += 1;
                    totalRecords -= 1;

                    if (totalRecords < 1) {
                        clearInterval(streetTimer);
                    }
                }, 1000);

            } else {
                console.log("No street data to process");
            }
        }
    });
}

let processPropertyV1 = () => {
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
                let totalRecords = doc.length;
                let propertyTimer = setInterval(() => {
                    photos = [];

                    if (doc[index]) {
                        doc[index].property_photos.forEach(photo => photos.push({
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
                                    '_id': doc[index]._id
                                }, {
                                    'parsed': true
                                }, {
                                    new: true
                                }, (err, newData) => {
                                    if (err || !newData) {
                                        console.log('An error occurred while updating record with parsed = true');
                                    } else {
                                        //index += 1;
                                        console.log(`PROPERTY Record ${index+1} processed`);
                                    }
                                });
                            } else {
                                console.log(`PROPERTY Record NOT processed`);
                            }
                        }).catch((err) => {
                            console.error(err);
                        });
                    }

                    index += 1;
                    totalRecords -= 1;

                    if (totalRecords < 1) {
                        clearInterval(propertyTimer);
                    }
                }, 1000);

            } else {
                console.log("No property data to process");
            }
        }
    });
}

let processEntityV1 = () => {
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
                let index = 0;
                let newRecord;
                let photos;

                let totalRecords = doc.length;

                let entityTimer = setInterval(() => {
                    photos = [];
                    if (doc[index]) {
                        doc[index].property_photos.forEach(photo => photos.push({
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

                        newRecord.save().then((_entityData) => {
                            if (_entityData) {
                                EntityRecord.findOneAndUpdate({
                                    '_id': doc[index]._id
                                }, {
                                    'parsed': true
                                }, {
                                    new: true
                                }, (err, newData) => {
                                    if (err || !newData) {
                                        console.log('An error occurred while updating record with parsed = true');
                                    } else {
                                        //index += 1;
                                        console.log(`ENTITY Record ${index+1} processed`);
                                    }
                                });
                            } else {
                                console.log(`ENTITY records NOT processed`);
                            }

                        }).catch((err) => {
                            console.error(err);
                        });
                    }

                    index += 1;
                    totalRecords -= 1;

                    if (totalRecords < 1) {
                        clearInterval(entityTimer);
                    }
                }, 1000);

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
                        'entity.entity_id': doc[index].entity.entity_id
                    }, {
                        'property_id': doc[index].property_id
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

let processStreetPhotos = () => {
    console.log('Parser Engine Started - Street Photos');
    StreetRecord.find({}, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} STREET Records to Process`);
                let newRecords = [];
                let newRecord = {};
                let photos;
                let count = 0;
                doc.forEach(_doc => {
                    count += 1;
                    console.log(`Start with RECORD ${count} with ID: ${_doc._id}`);
                    photos = [];
                    _doc.street_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }));

                    newRecord = {
                        street: {
                            street_id: _doc.street.street_id
                        },
                        street_photos: photos,
                        created: _doc.created
                    }

                    newRecords.push(newRecord);
                    console.log(`Done with RECORD ${count} with ID: ${_doc._id}`);

                });

                StreetPhoto.insertMany(newRecords, (err, docs) => {
                    if (!err) {
                        console.log('*************************************************************');
                        console.log(`${docs.length} STREET PHOTO records parsed successfully!`);
                        console.log('*************************************************************');
                    } else {
                        console.error(err);
                    }
                });


            } else {
                console.log("No street data to process");
            }
        }
    });
}

let processPropertyPhotos = () => {
    console.log('Parser Engine Started - Property Photos');
    PropertyRecord.find({}, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} PROPERTY Records to Process`);
                let newRecords = [];
                let newRecord = {};
                let photos;
                let count = 0;
                doc.forEach(_doc => {
                    count += 1;
                    console.log(`Start with RECORD ${count} with ID: ${_doc._id}`);
                    photos = [];
                    _doc.property_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }));

                    newRecord = {
                        property: {
                            property_id: _doc.property.property_id,
                            street_id: _doc.property.street_id,
                            building_serial_number: _doc.property.building_serial_number
                        },
                        property_photos: photos,
                        created: _doc.created
                    }

                    newRecords.push(newRecord);
                    console.log(`Done with RECORD ${count} with ID: ${_doc._id}`);

                });

                PropertyPhoto.insertMany(newRecords, (err, docs) => {
                    if (!err) {
                        console.log('*************************************************************');
                        console.log(`${docs.length} PROPERTY PHOTO records parsed successfully!`);
                        console.log('*************************************************************');
                    } else {
                        console.error(err);
                    }
                });


            } else {
                console.log("No property data to process");
            }
        }
    });
}

let processEntityPhotos = () => {
    console.log('Parser Engine Started - Entity Photos');
    EntityRecord.find({}, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} ENTITY Records to Process`);
                let newRecords = [];
                let newRecord = {};
                let photos;
                let count = 0;
                doc.forEach(_doc => {
                    count += 1;
                    console.log(`Start with RECORD ${count} with ID: ${_doc._id}`);
                    photos = [];
                    _doc.property_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }));

                    newRecord = {
                        entity: {
                            entity_id: _doc.entity.entity_id,
                            property_id: _doc.property_id
                        },
                        property_photos: photos,
                        created: _doc.created
                    }

                    newRecords.push(newRecord);
                    console.log(`Done with RECORD ${count} with ID: ${_doc._id}`);

                });

                EntityPhoto.insertMany(newRecords, (err, docs) => {
                    if (!err) {
                        console.log('*************************************************************');
                        console.log(`${docs.length} ENTITY PHOTO records parsed successfully!`);
                        console.log('*************************************************************');
                    } else {
                        console.error(err);
                    }
                });


            } else {
                console.log("No property data to process");
            }
        }
    });
}


let processBulkEntity = () => {
    console.log('Parser Engine Started - Entity Records');
    EntityRecord.find({}, (err, doc) => {
        if (err) {
            console.log('An error occured');
        } else {
            if (doc.length > 0) {
                console.log(`${doc.length} ENTITY Records to Process`);
                let newRecords = [];
                let newRecord = {};
                let photos;
                let count = 0;
                doc.forEach(_doc => {
                    count += 1;
                    photos = [];
                    _doc.property_photos.forEach(photo => photos.push({
                        url: photo.url,
                        snapshot_position: photo.snapshot_position
                    }));

                    newRecord = {
                        'property_id': _doc.property_id,
                        'entity': _doc.entity,
                        'property_photos': photos,
                        'created': _doc.created,
                        'modified': _doc.modified,
                        'modified_by': _doc.modified_by,
                        'entities': _doc.entities,
                        'location': {
                            'type': _doc.location.type,
                            'coordinates': {
                                'longitude': _doc.location.coordinates[0],
                                'latitude': _doc.location.coordinates[1]
                            },
                            'whatthreewords': _doc.location.whatth
                        },
                        'enumerator': _doc.enumerator,
                        'contact': _doc.contact,
                        'document_owner': _doc.document_owner,
                        'document_status': _doc.document_status
                    }

                    newRecords.push(newRecord);
                    console.log(`Done with RECORD ${count} with ID: ${_doc._id}`);

                });

                ParsedEntity.insertMany(newRecords, (err, docs) => {
                    if (!err) {
                        console.log('*************************************************************');
                        console.log(`${docs.length} ENTITY PHOTO records parsed successfully!`);
                        console.log('*************************************************************');
                    } else {
                        console.error(err);
                    }
                });


            } else {
                console.log("No entity data to process");
            }
        }
    }).skip(60000).limit(20000);
}

let processDuplicateStreet = () => {
    ParsedStreet.find({}, (err, docs) => {
        if (err) {
            console.log('No record to process');
        } else {
            if (!docs) {
                console.log('No record returned for processing');
            } else {
                console.log(`${docs.length} records for processing and save...`);
                fetchUniqueData(docs, 'street').then(uniqueData => {
                    UniqueStreet.insertMany(uniqueData, (err, returned) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`${returned.length} unique records processed and saved!`);
                        }

                    });
                });
            }
        }
    });
}

let processDuplicateProperty = () => {
    ParsedProperty.find({}, (err, docs) => {
        if (err) {
            console.log('No record to process');
        } else {
            if (!docs) {
                console.log('No record returned for processing');
            } else {
                console.log('PROPERTY RECORDS');
                console.log(`${docs.length} records for processing and save...`);
                fetchUniqueData(docs, 'property').then(uniqueData => {
                    UniqueProperty.insertMany(uniqueData, (err, returned) => {
                        if (err)
                            console.error(err);

                        console.log(`${returned.length} unique records processed and saved!`);
                    });
                });

            }
        }
    });
}


let processDuplicateEntity = () => {
    ParsedEntity.find({}, (err, docs) => {
        if (err) {
            console.log('No record to process');
        } else {
            if (!docs) {
                console.log('No record returned for processing');
            } else {
                console.log('ENTITY RECORDS');
                console.log(`${docs.length} records for processing and save...`);
                fetchUniqueData(docs, 'entity').then(uniqueData => {
                    UniqueEntity.insertMany(uniqueData, (err, returned) => {
                        if (err)
                            console.error(err);

                        console.log(`${returned.length} unique records processed and saved!`);
                    });
                });
            }
        }
    }).skip(30000).limit(36000);
}

exports.processStreet = processStreet;
exports.processProperty = processProperty;
exports.processEntity = processEntity;

exports.processBulkEntity = processBulkEntity;

exports.processUpdateEntity = processUpdateEntity;

exports.processStreetPhotos = processStreetPhotos;
exports.processEntityPhotos = processEntityPhotos;
exports.processPropertyPhotos = processPropertyPhotos;

exports.processDuplicateStreet = processDuplicateStreet;
exports.processDuplicateProperty = processDuplicateProperty;
exports.processDuplicateEntity = processDuplicateEntity;