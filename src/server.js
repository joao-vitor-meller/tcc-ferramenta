const express = require('express');
var cons = require('consolidate');
path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes'));

app.engine('dust', cons.dust);
app.set('views', __dirname + "/views")

app.use(express.static(path.join( __dirname, 'public')));

app.listen(3333);