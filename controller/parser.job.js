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
    return new Promise((resolve, reject)=>{
        console.log('Parser Engine Started - Street');
        StreetRecord.find({}, (err, docs) => {
            if (err) {
                console.log('An error occured');
                reject(err);
            } else {
                if (docs.length > 0) {
                    console.log(`${docs.length} STREET Records to Process`);
                    parseRecords(docs, 'street').then(returned => {
                        if (returned.length > 0) {
                            console.log(`${returned.length} street records for bulk processing...`);
                            ParsedStreet.insertMany(returned, (err, savedDocs) => {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                } else {
                                    console.log(`${savedDocs.length} street records saved!`);
                                    resolve(true);
                                }
                            })
                        } else {
                            resolve(false);
                            console.log('Nothing to process here (Street)');
                        }
                    });
    
                } else {
                    resolve(false);
                    console.log("No  property data to process");
                }
            }
        });
    }); 
}


let processProperty = () => {
    return new Promise((resolve, reject)=>{
        console.log('Parser Engine Started - Property');
        PropertyRecord.find({}, (err, docs) => {
            if (err) {
                console.log('An error occured');
                reject(err);
            } else {
                if (docs.length > 0) {
                    console.log(`${docs.length} PROPERTY Records to Process`);
                    parseRecords(docs, 'property').then(returned => {
                        if (returned.length > 0) {
                            console.log(`${returned.length} property records for bulk processing...`);
                            ParsedProperty.insertMany(returned, (err, savedDocs) => {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                } else {
                                    console.log(`${savedDocs.length} property records saved!`);
                                    resolve(true);
                                }
                            })
                        } else {
                            console.log('Nothing to process here (Property)');
                            resolve(false);
                        }
                    });
    
                } else {
                    console.log("No street data to process");
                    resolve(false);
                }
            }
        });
    });
    
}


let processEntity = () => {
    return new Promise((resolve, reject)=>{
        console.log('Parser Engine Started - Entity');
        EntityRecord.find({}, (err, docs) => {
            if (err) {
                console.log('An error occured');
                reject(err);
            } else {
                if (docs.length > 0) {
                    console.log(`${docs.length} ENTITY Records to Process`);
                    parseRecords(docs, 'entity').then(returned => {
                        if (returned.length > 0) {
                            console.log(`${returned.length} entity records for bulk processing...`);
                            ParsedEntity.insertMany(returned, (err, savedDocs) => {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                } else {
                                    console.log(`${savedDocs.length} entity records saved!`);
                                    resolve(true);
                                }
                            })
                        } else {
                            console.log('Nothing to process here (Entity)');
                            resolve(false);
                        }
                    });
    
                } else {
                    console.log("No entity data to process");
                    resolve(false);
                }
            }
        }).skip(30000).limit(40000);
    });
   
}

let processStreetPhotos = () => {
    console.log('Parser Engine Started - Street Photos');
    UniqueStreet.find({}, (err, doc) => {
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
    UniqueProperty.find({}, (err, doc) => {
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
    UniqueEntity.find({}, (err, doc) => {
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

let processDuplicateStreet = () => {
    return new Promise((resolve, reject)=>{
        ParsedStreet.find({}, (err, docs) => {
            if (err) {
                console.log('No record to process');
                reject(err);
            } else {
                if (!docs) {
                    console.log('No record returned for processing');
                    resolve(false);
                } else {
                    console.log(`${docs.length} records for processing and save...`);
                    fetchUniqueData(docs, 'street').then(uniqueData => {
                        UniqueStreet.insertMany(uniqueData, (err, returned) => {
                            if (err){
                                console.error(err);
                                reject(err);
                            }else{
                                if(returned){
                                    console.log(`${returned.length} unique street records processed and saved!`);
                                    resolve(true);  
                                }else{
                                    console.log(`No data street returned`);
                                    resolve(false);  
                                }
                                 
                            }
    
                        });
                    });
                }
            }
        });
    });
    
}

let processDuplicateProperty = () => {
    return new Promise((resolve, reject)=>{
        ParsedProperty.find({}, (err, docs) => {
            if (err) {
                console.log('No record to process');
                reject(err);
            } else {
                if (!docs) {
                    console.log('No record returned for processing');
                    resolve(false);
                } else {
                    console.log('PROPERTY RECORDS');
                    console.log(`${docs.length} records for processing and save...`);
                    fetchUniqueData(docs, 'property').then(uniqueData => {
                        UniqueProperty.insertMany(uniqueData, (err, returned) => {
                            if (err){
                                console.error(err);
                                reject(err);
                            }else{
                                if(returned){
                                    console.log(`${returned.length} unique property records processed and saved!`);
                                    resolve(true);  
                                }else{
                                    console.log(`No data property returned`);
                                    resolve(false);  
                                }
                                 
                            }
                        });
                    });
    
                }
            }
        });
    });
    
}


let processDuplicateEntity = () => {
    return new Promise((resolve, reject)=>{
        ParsedEntity.find({}, (err, docs) => {
            if (err) {
                console.log('No record to process');
                reject(err);
            } else {
                if (!docs) {
                    console.log('No record returned for processing');
                    resolve(false);
                } else {
                    console.log('ENTITY RECORDS');
                    console.log(`${docs.length} records for processing and save...`);
                    fetchUniqueData(docs, 'entity').then(uniqueData => {
                        UniqueEntity.insertMany(uniqueData, (err, returned) => {
                            if (err){
                                console.error(err);
                                reject(err);
                            }else{
                                if(returned){
                                    console.log(`${returned.length} unique entity records processed and saved!`);
                                    resolve(true);  
                                }else{
                                    console.log(`No data Entity returned`);
                                    resolve(false);  
                                }
                                 
                            }
                        });
                    });
                }
            }
        });
    });
   
}

exports.processStreet = processStreet;
exports.processProperty = processProperty;
exports.processEntity = processEntity;

exports.processDuplicateStreet = processDuplicateStreet;
exports.processDuplicateProperty = processDuplicateProperty;
exports.processDuplicateEntity = processDuplicateEntity;

exports.processStreetPhotos = processStreetPhotos;
exports.processEntityPhotos = processEntityPhotos;
exports.processPropertyPhotos = processPropertyPhotos;