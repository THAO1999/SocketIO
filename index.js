var express = require("express");
var app = express();
app.use(express.static("./public")) // http://localhost:3000/teo.png => chạy vào public tìm teo.png
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app)// dựng server để trả trang web về
server.listen(3000)// chạy server port 3000

app.get("/", function (req, res) {
    res.render("trangchu");
});