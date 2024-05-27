const express = require('express');
const fileUpload = require('express-fileupload');
const logger = require('morgan')
const path = require("path")
const cors = require('cors')


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(logger('dev'))
global.__basedir = __dirname;

app.use('/', require('./router/documentRouter'))
app.use('/', require('./router/userRouter'))

app.listen(5000,()=> console.log('express running'))