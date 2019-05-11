WebServer = require("express")();

WebServer.get("/", (req, res) => {
    res.sendfile("./frontend/html/index.html");
});

WebServer.listen(80, (err) => {
    if (err)
    {
        return console.log("Error listen: ",err);
    }

    console.log("Listening port: 80");
});
