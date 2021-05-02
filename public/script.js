   // gọi lên server
   var socket = io("http://localhost:3000");
   socket.on("server-register-fail", function() {
       alert("username đã tồn tại")
   });
   socket.on("server-send-all-clients", function(arrayUsers) {
       $("#boxContent").html("");
       arrayUsers.forEach(function(i) {
           $("#boxContent").append("<div class='user' >" + i + "</div>")
       });
   });

   socket.on("server-send-message", function(data) {
       $("#listMessage").append("<div class='ms'>" + data.name + ":" + data.content + " </div>")
   });
   socket.on("server-register-success", function(dataFromServer) {

       $("#currentUser").html(dataFromServer);
       $('#loginForm').hide(2000);
       $("#chatForm").show(1000);
   });
   $(document).ready(function() {
       $('#loginForm').show();
       $("#chatForm").hide();
       $('#btnRegister').click(function() {
           var person = {
               name: $("#txtUserName").val(),
               id: $("#txtID").val(),
           };
           socket.emit("client-send-UserName", person);
       });
       $('#btnLogout').click(function() {
           socket.emit("client-logout");
           $('#loginForm').show(1000);
           $("#chatForm").hide(2000);
       });

       $('#btnSendMessage').click(function() {
           var message = {
               msg: $("#txtMessage").val(),
               userId: 1,
           };
           socket.emit('user-send-message', message);

       });
       $("#txtMessage").focusin(function() {
               socket.emit("client-input");
           })
           //    $("#txtMessage").focusout(function() {
           //        socket.emit("client-output");
           //    })
   });