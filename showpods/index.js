const winston = require('winston');
const express = require('express');
const app = express();

const k8s = require('@kubernetes/client-node');

// setup logger
const logger = winston.createLogger({
    level: 'info',
    transports: []
});

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
    )
}));

// setup kubernetes
const kc = new k8s.KubeConfig();

if ( process.env.KUBERNETES_SERVICE_HOST ) {
    kc.loadFromCluster();
} else {
    kc.loadFromDefault();
}

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const namespace = process.env.NAMESPACE || 'default';

app.get('/', (req, res) => {
    let result = [];
    k8sApi.listNamespacedPod(namespace).then(pods => {
        pods.body.items.forEach(pod => {
            result.push(pod.metadata.name);
        });

        res.send(result);
    });
});

app.get('/live', (req, res) => res.send("OK")); // live and readiness probe

// starting
const port = 8080;
app.listen(port, () => logger.info("Started at port " + port));