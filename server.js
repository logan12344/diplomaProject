express = require('express');
WebServer = express();

WebServer.use(express.static(__dirname + '/frontend'));

WebServer.get("/", (req, res) => {
    res.render('index.html');
	
});

WebServer.listen(80, (err) => {
    if (err)
    {
        return console.log("Error listen: ",err);
    }

    console.log("Listening port: 80");
});
