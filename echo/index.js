const express = require('express');
const app = express();
const os = require('os');
const fs = require('fs');
const morgan = require('morgan')

const client = require('prom-client');
client.collectDefaultMetrics();

app.use(morgan('combined'));
app.get('/live', (req, res) => res.send("OK"));
app.get('/ready', (req, res) => res.send("OK"));

app.get('/metrics', (request, response) => {
  response.set('Content-Type', client.register.contentType);
  response.send(client.register.metrics());
});

app.all('/*', (req, res) => {
    let str = fs.readFileSync('./template.html').toString();

    // headers
    let headers = '';
    Object.keys(req.headers).forEach(k => {
        headers += "<tr><td>"+k+"</td><td>" + req.headers[k] + "</td></tr>";
    });
    str = str.replace('\$HEADERS', headers);

    // env vars
    let envvars = '';
    Object.keys(process.env).forEach(k => {
      envvars += "<tr><td>"+k+"</td><td>" + process.env[k] + "</td></tr>";

      if ( k == 'HOSTNAME' ) {
        str = str.replace('\$HOSTNAME', process.env[k]);
      }
    });
    str = str.replace('\$ENVVARS', envvars);

    // remote address
    str = str.replace('\$REMOTEADDR', req.connection.remoteAddress);
    str = str.replace('\$SOCKADDR', req.socket.remoteAddress);

    // host
    str = str.replace('\$HOST', os.hostname());
    str = str.replace('\$UPTIME', os.uptime());
    
    // call
    str = str.replace('\$CALL', req.method + " " + req.originalUrl);

    res.send(str);
});

app.listen(8080, () => console.log(`Echo server listening`))