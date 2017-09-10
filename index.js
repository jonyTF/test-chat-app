var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('user connected!');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg) {
		console.log('received chat message');
		io.emit('chat message', msg);
	});
	socket.on('add user', function(nickname) {
		io.emit('chat message', 'User ' + nickname + ' joined the lobby');
	});
});

http.listen(process.env.PORT || 3000, function() {
	console.log('listening on *:3000 or Heroku port');
});

