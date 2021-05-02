var express = require("express");
var app = express();
app.use(express.static("./public")) // http://localhost:3000/teo.png => chạy vào public tìm teo.png
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app) // dựng server để trả trang web về
server.listen(3000) // chạy server port 3000
var arrayUsers = [];

var io = require("socket.io")(server);
// lắng nghe client kết nối lên
io.on("connection", (socket) => {
    //biến socket để quản lí kết nối của từng client, biết được ai với ai vì mỗi socket đều có id
    console.log("có người kết nối" + socket.id);
    socket.on("disconnect", function() {
        console.log("ngắt kết nối: " + socket.id);
    });

    socket.on("client-send-UserName", function(data) {

        if (arrayUsers.indexOf(data.name) >= 0) {
            console.log(arrayUsers);
            socket.emit("server-register-fail");
        } else {
            arrayUsers.push(data.name);
            socket.UserName = data.name;
            socket.id = data.id;
            socket.emit("server-register-success", data.name);
            io.sockets.emit("server-send-all-clients", arrayUsers)
        }

    });
    socket.on("client-logout", function(data) {

        arrayUsers.splice(
            arrayUsers.indexOf(socket.UserName), 1
        );
        socket.broadcast.emit("server-send-all-clients", arrayUsers)
    });
    // 
    socket.on("user-send-message", function(dataMessage) {
        console.log(dataMessage.userId);
        socket.broadcast.emit("server-send-message", { name: socket.UserName, content: dataMessage.msg })
            //io.to(dataMessage.userId).emit("server-send-message", { name: socket.UserName, content: dataMessage.msg });
            //   io.to('1').emit("server-send-message", { name: socket.UserName, content: dataMessage.msg })
            // socket.broadcast.to(dataMessage.userId).emit("server-send-message", { name: socket.UserName, content: dataMessage.msg })
    });
    socket.on("client-input", function() {
        console.log("dang go chu");
    });
    socket.on("client-output", function() {
        console.log("stop");
    });
});

app.get("/", function(req, res) {
    res.render("home");
});
app.get("/admin", function(req, res) {
    res.render("admin");
});
//io.sockets.emit("server-send-clients", data + "999"); // server send data to all client, vì thư viện io có tất cả socket nên mới trả về all client
// socket.emit("server-send-clients", data + "999"); // server only send data to  client that client send server //khi A đăng nhập sai thì chỉ gửi cho thằng A thôi, vì socket là thằng gửi dữ liệu
// socket.broadcast.emit("server-send-clients", data + "999"); // server respond about all client expect it