var express = require("express");
var redis = require("redis");
var router = express.Router();
var crypto = require ("crypto");

/* Storage for the messages */
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

/* create and setup a Redis client */
var messages = redis.createClient(REDIS_PORT, REDIS_HOST);
messages.on('connect', function() {
    console.log('Redis client connected');
});
messages.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

/* Fetch a message for a given SHA */
router.get('/:sha', function (req, res) {
    var sha = req.params.sha;
    console.info('Requested sha: "%s"', sha);
    messages.get(sha, function (error, message) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('GET result ->' + message);
        if (message == undefined) {
            res.status(404).end('Requested sha: ' + req.params.sha);
        }
        res.set('Content-Type', 'application/json').end(message);
    });
});

/* Store a message and return a SHA */
router.post('/', function (req, res) {
    var body = req.body.toString();
    var hash = crypto.createHash('sha256').update(body).digest('hex');
    var response = {digest: hash};
    messages.set(hash, body);
    console.log(response);
    res.json(response);
});

module.exports = router;