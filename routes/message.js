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
router.get('/:hash', function (req, res) {
    var hash = req.params.hash;
    console.info('Requested hash: "%s"', hash);
    messages.get(hash, function (error, message) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('GET result ->' + message);
        if (message == undefined) {
            res.status(404).json({err_msg: "Message not found"});
        } else {
            res.json({message: message});
        }
    });
});

/* Store a message and return a SHA */
router.post('/', function (req, res) {
    var message = req.body.message;
    var hash = crypto.createHash('sha256').update(message).digest('hex');
    var response = {digest: hash};
    messages.set(hash, message);
    console.log('Message: ' + message);
    console.log('Response: ' + response);
    res.status(201).json(response);
});

module.exports = router;