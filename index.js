var express = require("express");
var app = express();
app.use(express.static("./public")) // http://localhost:3000/teo.png => chạy vào public tìm teo.png
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app)// dựng server để trả trang web về
server.listen(3000)// chạy server port 3000

var io = require("socket.io")(server);
// lắng nghe client kết nối lên
io.on("connection", function (socket) {
    //biến socket để quản lí kết nối của từng client, biết được ai với ai vì mỗi socket đều có id
    console.log("có người kết nối" + socket.id);
    socket.on("disconnect", function () {
        console.log("ngắt kết nối: " + socket.id);
    })
});
app.get("/", function (req, res) {
    res.render("home");
});