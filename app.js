var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var path = require('path');
var config = require('./config/database');
var headers = require('./middleware/headers');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
// var parserJob = require('./controller/parser.job');
var pc = require('./controller/parser.controller');

var port = process.env.PORT || 6111;

mongoose.Promise = global.Promise;
mongoose.connect(config.database.mlab1, {
    useMongoClient: true,
    config: {
        autoIndex: false
    },
    promiseLibrary: global.Promise
});


//let chronos;

var app = express();

//set directory of log files
var logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})

// setup the logger
app.use(morgan('combined', {
    stream: accessLogStream
}));

//cross origin resourse sharing
app.use(cors());

//body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    limit: '500mb'
}));


// middleware to use for all requests headers
app.use(headers);



//start server and listen on specified port
app.listen(port, function () {
    console.log('SPiDER Server is running on port ' + port);
});


mongoose.connection.on('open', () => {
    console.log('SPiDER Database is connected');

  /*   const doUser = () => {
        return new Promise((resolve, reject) => {
            //User Parser Job
            parserJob.processUser().then(value => {
                console.log(value.length + ' users saved successfully!');
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    const doStreet = () => {
        return new Promise((resolve, reject) => {
            //Street Parser Job
            parserJob.processStreet().then(value => {
                parserJob.processStreetPhotos().then(() => {
                    resolve();
                });
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    const doProperty = () => {
        return new Promise((resolve, reject) => {
            //Property Parser Job
            parserJob.processProperty().then(value => {
                console.log('DONE');
                parserJob.processPropertyPhotos().then(() => {
                    resolve();
                });
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    } */

    /* const doEntity = () => {
        return new Promise((resolve, reject) => {
            //Entity Parser Job
            parserJob.processEntity().then(value => {
                console.log('DONE: ' + value);
                parserJob.processEntityPhotos().then(() => {
                    resolve();
                });
            }).catch(err => {
                console.error(err);
            });
        });
    }

    doEntity().then(() => {
        console.log('Task Completed!');
    }); */
/* 
    doUser().then(() => {
        doStreet().then(() => {
            doProperty().then(() => {
                doEntity().then(() => {
                    console.log('Task Completed!');
                });
            }).catch(console.log);
        }).catch(console.log);
    }).catch(console.log); */


});


// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
    //clearInterval(chronos);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});