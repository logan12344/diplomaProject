express = require('express');
WebServer = express();

WebServer.use(express.static(__dirname + '/frontend'));

WebServer.get("/", (req, res) => {
    res.render('index.html');
});

WebServer.get("/api/:method",handle);

WebServer.listen(80, (err) => {
    if (err)
    {
        return console.log("Error listen: ",err);
    }

    console.log("Listening port: 80");
});

function handle(req,res){
    [group, method] = req.params.method.split('.',2);
    if (method){
        "auth.signIn"
        console.log(group);
        console.log(method);
        res.send("ok");
    }
    else
    res.status(404).end();
}