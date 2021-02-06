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

    let showHeaders = true;
    if ( process.env.SHOW_HEADERS && process.env.SHOW_HEADERS == "false" ) {
      showHeaders = false;
    }
    let showEnvvars = true;
    if ( process.env.SHOW_ENV_VARS && process.env.SHOW_ENV_VARS == "false" ) {
      showEnvvars = false;
    }

    // headers
    let headers = '';
    if ( showHeaders ) {
      Object.keys(req.headers).forEach(k => {
          headers += "<tr><td>"+k+"</td><td>" + req.headers[k] + "</td></tr>";
      });
    }
    str = str.replace('\$HEADERS', headers);
    str = str.replace('\$SHOWHEADERS', showHeaders ? 'table-header-group' : 'none');

    // env vars
    let envvars = '';
    if ( showEnvvars ) {
      Object.keys(process.env).forEach(k => {
        envvars += "<tr><td>"+k+"</td><td>" + process.env[k] + "</td></tr>";

        if ( k == 'HOSTNAME' ) {
          str = str.replace('\$HOSTNAME', process.env[k]);
        }
      });
    }
    str = str.replace('\$ENVVARS', envvars);
    str = str.replace('\$SHOWENV', showEnvvars ? 'table-header-group' : 'none');

    // remote address
    str = str.replace('\$REMOTEADDR', req.connection.remoteAddress);
    str = str.replace('\$SOCKADDR', req.socket.remoteAddress);

    // host
    str = str.replace('\$HOST', os.hostname());
    str = str.replace('\$UPTIME', os.uptime());
    
    // call
    str = str.replace('\$CALL', req.method + " " + req.originalUrl);

    if ( process.env.WATCH_DIR != undefined ) {
      const fileList = fs.readdirSync(process.env.WATCH_DIR);
      
      let files = '';
      fileList.forEach(file => {
        let path = process.env.WATCH_DIR + "/" + file;
        files += "<tr><td>"+path+"</td><td>" + fs.readFileSync(path) + "</td></tr>";
      })

      str = str.replace('\$FILES', files);
      str = str.replace('\$SHOWFILES', 'table-header-group');
    } else {
      str = str.replace('\$SHOWFILES', 'none');
    }

    res.send(str);
});

app.listen(8080, () => console.log(`Echo server listening`))