#!/usr/bin/env node

import express from 'express';

const app = express();

import fs from 'fs'; 

import http from 'http';
http.createServer(app).listen(80);
console.log("listening on port 80");

const tlsPrivateKey = fs.readFileSync("./key.pem");
const tlsCertificate = fs.readFileSync("./cert.pem");
import https from 'https';
const options = {
    key: tlsPrivateKey,
    cert: tlsCertificate
}
https.createServer(options, app).listen(443);
console.log("listening on port 443");

app.use(function(req,res,next) {
    if (!req.secure) {
        res.redirect(301,'https://' + req.headers.host + req.url);
    }
    else {
        next();
    }
});

app.use(express.static('static'));

app.get('/',function(req,res) {
    res.redirect(303, "/FunctionalTests/ASYNC_MENU.HTML");
});

app.use(function(req,res) {
    res.status(404).send('NOT FOUND');
});

app.use(function(err,req,res,next) {
    console.log("Error: " + err.stack);
    res.status(500).send('INTERNAL ERROR');
});

