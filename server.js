express = require('express');
WebServer = express();

auth = require('./backend/auth');

WebServer.use(express.static(__dirname + '/frontend'));
WebServer.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
WebServer.use(express.json());

WebServer.get('/', (req, res) => {
    res.render('index.html');
});

WebServer.get('/api/:method',handle);

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
                res.json(auth.exec(method,req.query));
                break;
            default:
                res.json({error: true, result: 'Method group not found' });
        }
    }
    else
    res.status(404).end();
}