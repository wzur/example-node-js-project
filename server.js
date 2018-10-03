const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json({type: "application/json"}));

const crasher = require('./routes/crasher');
const message = require('./routes/message');

app.get('/', (req, res) => {
    res.send('Hello world\n');
});

app.use('/crasher', crasher);
app.use('/messages', message);

/* Log 404 responses */
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    res.status(404).end();
});

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, () => {
    const port = server.address().port;
    console.info('Server started on port %s', port);
});
