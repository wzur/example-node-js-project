var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json({type: "application/json"}));

var crasher = require('./routes/crasher');
var message = require('./routes/message');

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use('/crasher', crasher);
app.use('/messages', message);

/* Log 404 responses */
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    res.status(404).end();
});

const PORT = process.env.PORT || 5000


var server = app.listen(PORT, () => {
    var port = server.address().port;
    console.info('Server started on port %s', port);
});
