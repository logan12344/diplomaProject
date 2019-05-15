const express = require('express');
const WebServer = express();
const fileUpload = require('express-fileupload');

const pg_config = require('./backend/pg_config.json');
const Pool = require('pg').Pool;
const pg_db = new Pool(pg_config);

const auth = require('./backend/auth');
const file = require('./backend/file');
const schedule = require('./backend/schedule');
const teachers = require('./backend/teachers');
const subjects = require('./backend/subjects');
const educationalplan = require('./backend/educationalplan');
const individualplan = require('./backend/individualplan');
const workprogram = require('./backend/workprogram');
const account = require('./backend/account');

WebServer.use(express.static(__dirname + '/frontend'));
WebServer.use(express.urlencoded());
WebServer.use(fileUpload({ createParentPath: true }));

WebServer.get('/', (req, res) => {
    res.render('index.html');
});

WebServer.get('/api/:method',handle);

WebServer.post('/api/:method',(req, res, next) => {
    req.query = req.body;
    next();
},handle);

WebServer.listen(80, (err) => {
    if (err)
    {
        return console.log('Error listen: ',err);
    }

    console.log('Listening port: 80');
});

function handle(req,res){
    [group, method] = req.params.method.split('.',2);
    if (method){
        switch (group){
            case 'auth':
                auth.exec(method,req.query,pg_db,res);
                break;
            case 'file':
                file.exec(method,req.query,req.files,pg_db,res)
                break;
            case 'schedule':
                schedule.exec(method,req.query,pg_db,res);
                break;
            case 'teachers':
                teachers.exec(method,req.query,pg_db,res);
                break;
            case 'subjects':
                subjects.exec(method,req.query,pg_db,res);
                break;
            case 'educationalplan':
                educationalplan.exec(method,req.query,pg_db,res);
                break;
            case 'individualplan':
                individualplan.exec(method,req.query,pg_db,res);
                break;
            case 'workprogram':
                workprogram.exec(method,req.query,pg_db,res);
                break;
            case 'account':
                account.exec(method,req.query,pg_db,res);
                break;
            default:
                res.status(404).end();
                break;
        }
    }
    else
    res.status(404).end();
}