const express = require('express');
const app = express();
const morgan = require('morgan');
const crypto = require('crypto'); 

const client = require('prom-client');
client.collectDefaultMetrics();

app.use(morgan('combined'));
app.get('/live', (req, res) => res.send("OK"));
app.get('/ready', (req, res) => res.send("OK"));

app.get('/metrics', (request, response) => {
  response.set('Content-Type', client.register.contentType);
  response.send(client.register.metrics());
});

app.listen(8080, () => console.log(`Out of memory server listening`));

let blob = [];

const speed = process.env.SPEED || 50;
const size = process.env.SIZE || 1024;

console.log(speed);
console.log(size);

setInterval(() => {
    for (let index = 0; index < 100; index++) {
        crypto.randomBytes(size, (err, buf) => { 
            blob.push(buf);
        });
    }
}, speed);