let express = require('express');
let router = express.Router();
let parserJob = require('../controller/parser.job');

/* router.get('/cron/job/start', parserJob.start); //Start Cron Job
router.get('/cron/job/status', parserJob.status); //Check Status of Job */

module.exports = router;
